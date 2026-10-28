// ChyGodwin Foods API - Cloudflare Worker (D1 + KV + static assets)
//
// Secrets (never commit): ADMIN_PASSWORD_HASH, TOKEN_SECRET
// Vars (wrangler.toml):   ADMIN_EMAIL
// Bindings:               DB (D1), ADMIN_LIMITS_KV (KV), ASSETS (static site)
//
// Tokens are HMAC-signed with TOKEN_SECRET and carry a role:
//   r:'admin'    - the store owner (8 hours)
//   r:'customer' - a registered shopper (14 days)
// A customer token can never pass an admin check.

import { scrypt, timingSafeEqual, createHmac, randomBytes } from 'node:crypto';

// ==================== Constants ====================
const ADMIN_TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const CUSTOMER_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_SECONDS = 15 * 60;
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const MAX_ORDER_BYTES = 50 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Used so a login for an unknown email takes as long as a real one
const DUMMY_HASH = `${'00'.repeat(16)}:${'00'.repeat(64)}`;

// ==================== Helpers ====================
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? body : null;
  } catch {
    return null;
  }
}

function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'local';
}

function safeEqual(a, b) {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && timingSafeEqual(A, B);
}

function deriveKey(password, salt) {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, key) =>
      err ? reject(err) : resolve(key)
    );
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  try {
    const [saltHex, hashHex] = String(stored).split(':');
    const derived = await deriveKey(password, Buffer.from(saltHex, 'hex'));
    const expected = Buffer.from(hashHex, 'hex');
    return expected.length === derived.length && timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

// ---- Failure / rate counters (KV) ----
async function getCount(env, key) {
  if (!env.ADMIN_LIMITS_KV) return 0;
  return parseInt((await env.ADMIN_LIMITS_KV.get(key)) || '0', 10);
}
async function bumpCount(env, key, current, ttlSeconds) {
  if (env.ADMIN_LIMITS_KV) {
    await env.ADMIN_LIMITS_KV.put(key, String(current + 1), { expirationTtl: ttlSeconds });
  }
}
async function clearCount(env, key) {
  if (env.ADMIN_LIMITS_KV) await env.ADMIN_LIMITS_KV.delete(key);
}

// ==================== Token signing / verification ====================
function signToken(claims, secret, ttlMs) {
  const payload = Buffer.from(JSON.stringify({ ...claims, x: Date.now() + ttlMs })).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyToken(token, secret) {
  if (!secret) return null;
  const [payload, sig] = String(token || '').split('.');
  if (!payload || !sig) return null;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  if (!safeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data && data.x > Date.now() ? data : null;
  } catch {
    return null;
  }
}

function bearer(request) {
  const header = request.headers.get('Authorization') || '';
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

function adminClaims(token, env) {
  const data = verifyToken(token, env.TOKEN_SECRET);
  if (!data || data.r !== 'admin' || !env.ADMIN_EMAIL) return null;
  return String(data.e).toLowerCase() === env.ADMIN_EMAIL.trim().toLowerCase() ? data : null;
}

function customerClaims(request, env) {
  const data = verifyToken(bearer(request), env.TOKEN_SECRET);
  return data && data.r === 'customer' && data.u ? data : null;
}

// Returns null when authorised, or a Response to send back.
function requireAdmin(request, env) {
  if (!env.TOKEN_SECRET || !env.ADMIN_EMAIL) {
    return json({ error: 'Admin is not configured on this deployment.' }, 503);
  }
  return adminClaims(bearer(request), env) ? null : json({ error: 'Unauthorized.' }, 401);
}

// ==================== Admin login ====================
async function handleAdminLogin(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const hash = env.ADMIN_PASSWORD_HASH;
  if (!env.ADMIN_EMAIL || !hash || !hash.includes(':') || !env.TOKEN_SECRET) {
    return json({ error: 'Admin login is not configured on this deployment.' }, 503);
  }

  const body = await readJson(request);
  if (!body) return json({ error: 'Bad request.' }, 400);

  // Session check used by the admin page after a refresh: { action: 'verify', token }
  if (body.action === 'verify') {
    const data = adminClaims(body.token, env);
    return data ? json({ ok: true, email: data.e }) : json({ ok: false }, 401);
  }

  const limitKey = `login-fail:${clientIp(request)}`;
  const fails = await getCount(env, limitKey);
  if (fails >= MAX_FAILED_LOGINS) return json({ error: 'Too many attempts. Try again later.' }, 429);

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!email || !password) return json({ error: 'Invalid email or password.' }, 400);

  const passOk = await verifyPassword(password, hash);
  const emailOk = safeEqual(email, env.ADMIN_EMAIL.trim().toLowerCase());

  if (!(passOk && emailOk)) {
    await bumpCount(env, limitKey, fails, LOCKOUT_SECONDS);
    return json({ error: 'Invalid email or password.' }, 401);
  }

  await clearCount(env, limitKey);
  const token = signToken({ r: 'admin', e: email }, env.TOKEN_SECRET, ADMIN_TOKEN_TTL_MS);
  return json({ ok: true, email, token });
}

// ==================== Customer accounts ====================
function publicUser(row) {
  return { id: row.id, email: row.email, name: row.name || '' };
}

function customerToken(user, env) {
  return signToken({ r: 'customer', u: user.id, e: user.email }, env.TOKEN_SECRET, CUSTOMER_TOKEN_TTL_MS);
}

async function handleSignup(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!env.TOKEN_SECRET) return json({ error: 'Accounts are not configured on this deployment.' }, 503);

  const limitKey = `signup:${clientIp(request)}`;
  const attempts = await getCount(env, limitKey);
  if (attempts >= 10) return json({ error: 'Too many sign-ups from this network. Try again later.' }, 429);

  const body = await readJson(request);
  if (!body) return json({ error: 'Bad request.' }, 400);

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const name = String(body.name || '').trim().slice(0, 100);

  if (!EMAIL_RE.test(email) || email.length > 254) return json({ error: 'Enter a valid email address.' }, 400);
  if (password.length < 8 || password.length > 128) {
    return json({ error: 'Password must be 8 to 128 characters.' }, 400);
  }
  if (env.ADMIN_EMAIL && email === env.ADMIN_EMAIL.trim().toLowerCase()) {
    return json({ error: 'This email cannot be used for a shopper account.' }, 400);
  }

  await bumpCount(env, limitKey, attempts, 3600);

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return json({ error: 'An account with this email already exists. Please sign in.' }, 409);

  const user = { id: crypto.randomUUID(), email, name };
  await env.DB.prepare('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)')
    .bind(user.id, email, await hashPassword(password), name)
    .run();

  return json({ ok: true, token: customerToken(user, env), user: publicUser(user) }, 201);
}

async function handleCustomerLogin(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!env.TOKEN_SECRET) return json({ error: 'Accounts are not configured on this deployment.' }, 503);

  const body = await readJson(request);
  if (!body) return json({ error: 'Bad request.' }, 400);

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!email || !password) return json({ error: 'Invalid email or password.' }, 400);

  const limitKey = `cust-login-fail:${clientIp(request)}:${email}`;
  const fails = await getCount(env, limitKey);
  if (fails >= MAX_FAILED_LOGINS) return json({ error: 'Too many attempts. Try again later.' }, 429);

  const row = await env.DB.prepare('SELECT id, email, name, password_hash FROM users WHERE email = ?')
    .bind(email)
    .first();
  const ok = await verifyPassword(password, row ? row.password_hash : DUMMY_HASH);

  if (!row || !ok) {
    await bumpCount(env, limitKey, fails, LOCKOUT_SECONDS);
    return json({ error: 'Invalid email or password.' }, 401);
  }

  await clearCount(env, limitKey);
  return json({ ok: true, token: customerToken(row, env), user: publicUser(row) });
}

async function handleSession(request, env) {
  const claims = customerClaims(request, env);
  if (!claims) return json({ error: 'Not signed in.' }, 401);
  const row = await env.DB.prepare('SELECT id, email, name FROM users WHERE id = ?').bind(claims.u).first();
  return row ? json({ user: publicUser(row) }) : json({ error: 'Not signed in.' }, 401);
}

// ==================== Products ====================
// GET is public. POST/PUT/DELETE require an admin token.
async function handleProducts(request, env, url) {
  const match = url.pathname.match(/^\/api\/products(?:\/([^/]+))?$/);
  const pathId = match && match[1] ? decodeURIComponent(match[1]) : null;

  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, data FROM app_products ORDER BY updated_at DESC'
    ).all();
    const products = results.map((row) => {
      let parsed = {};
      try {
        parsed = JSON.parse(row.data);
      } catch {
        /* skip malformed row contents */
      }
      return { ...parsed, id: row.id };
    });
    return json(products);
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const denied = requireAdmin(request, env);
    if (denied) return denied;

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Bad request.' }, 400);
    }

    const items = Array.isArray(body) ? body : [body];
    if (items.length === 0 || items.length > 200 || items.some((p) => !p || typeof p !== 'object')) {
      return json({ error: 'Invalid product data.' }, 400);
    }

    const stmt = env.DB.prepare(
      `INSERT INTO app_products (id, data) VALUES (?, ?)
       ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`
    );
    const ids = [];
    const batch = items.map((p) => {
      const id = String(p.id || pathId || crypto.randomUUID());
      ids.push(id);
      return stmt.bind(id, JSON.stringify({ ...p, id }));
    });
    await env.DB.batch(batch);
    return json({ success: true, ids });
  }

  if (request.method === 'DELETE') {
    const denied = requireAdmin(request, env);
    if (denied) return denied;
    const id = pathId || url.searchParams.get('id');
    if (!id) return json({ error: 'Missing product id.' }, 400);
    await env.DB.prepare('DELETE FROM app_products WHERE id = ?').bind(id).run();
    return json({ success: true });
  }

  return json({ error: 'Method not allowed.' }, 405);
}

// ==================== Cart ====================
// Signed-in shoppers: one cart per account. Guests: one cart per X-Cart-Id.
function cartOwner(request, env) {
  const customer = customerClaims(request, env);
  if (customer) return customer.u;
  const id = request.headers.get('X-Cart-Id') || '';
  return /^[\w-]{8,64}$/.test(id) ? `guest:${id}` : null;
}

const clip = (value, max) => (value == null ? null : String(value).slice(0, max));
const clampQty = (value) => Math.max(1, Math.min(999, parseInt(value, 10) || 1));
const cleanPrice = (value) => (Number.isFinite(Number(value)) ? Number(value) : null);

const CART_UPSERT = `INSERT INTO cart_items
    (user_id, product_id, product_name, product_image, price, quantity, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT (user_id, product_id) DO UPDATE SET
    quantity = excluded.quantity,
    product_name = COALESCE(excluded.product_name, product_name),
    product_image = COALESCE(excluded.product_image, product_image),
    price = COALESCE(excluded.price, price),
    updated_at = CURRENT_TIMESTAMP`;

async function handleCart(request, env, url) {
  const owner = cartOwner(request, env);
  if (!owner) return json({ error: 'Missing cart id.' }, 400);
  const isAdd = url.pathname === '/api/cart/add';

  if (request.method === 'GET' && !isAdd) {
    const { results } = await env.DB.prepare(
      `SELECT product_id, product_name, product_image, price, quantity
       FROM cart_items WHERE user_id = ? ORDER BY updated_at DESC`
    ).bind(owner).all();
    return json(results);
  }

  if (request.method === 'DELETE' && !isAdd && url.searchParams.get('all') === '1') {
    await env.DB.prepare('DELETE FROM cart_items WHERE user_id = ?').bind(owner).run();
    return json({ success: true });
  }

  const body = await readJson(request);
  if (!body) return json({ error: 'Bad request.' }, 400);

  // Add one unit (atomic increment) and return the new quantity
  if (isAdd && request.method === 'POST') {
    const productId = clip(body.productId, 100);
    if (!productId) return json({ error: 'Missing productId.' }, 400);
    await env.DB.prepare(
      `INSERT INTO cart_items
         (user_id, product_id, product_name, product_image, price, quantity, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, product_id) DO UPDATE SET
         quantity = MIN(quantity + 1, 999),
         product_name = COALESCE(excluded.product_name, product_name),
         product_image = COALESCE(excluded.product_image, product_image),
         price = COALESCE(excluded.price, price),
         updated_at = CURRENT_TIMESTAMP`
    ).bind(owner, productId, clip(body.productName, 200), clip(body.productImage, 500), cleanPrice(body.price)).run();
    const row = await env.DB.prepare('SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?')
      .bind(owner, productId)
      .first();
    return json({ success: true, quantity: row ? row.quantity : 1 });
  }

  // Set quantities (bulk upsert). Accepts { items: [...] } or one item.
  if (request.method === 'POST') {
    const items = Array.isArray(body.items) ? body.items : [body];
    if (items.length === 0 || items.length > 100) return json({ error: 'Invalid cart data.' }, 400);
    const stmt = env.DB.prepare(CART_UPSERT);
    const batch = [];
    for (const item of items) {
      const productId = clip(item?.productId ?? item?.product_id, 100);
      if (!productId) return json({ error: 'Missing productId.' }, 400);
      batch.push(stmt.bind(
        owner,
        productId,
        clip(item.productName ?? item.product_name, 200),
        clip(item.productImage ?? item.product_image, 500),
        cleanPrice(item.price),
        clampQty(item.quantity)
      ));
    }
    await env.DB.batch(batch);
    return json({ success: true });
  }

  if (request.method === 'PATCH') {
    const productId = clip(body.productId, 100);
    if (!productId) return json({ error: 'Missing productId.' }, 400);
    await env.DB.prepare(
      'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?'
    ).bind(clampQty(body.quantity), owner, productId).run();
    return json({ success: true });
  }

  if (request.method === 'DELETE') {
    const productId = clip(body.productId, 100);
    if (!productId) return json({ error: 'Missing productId.' }, 400);
    await env.DB.prepare('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?')
      .bind(owner, productId)
      .run();
    return json({ success: true });
  }

  return json({ error: 'Method not allowed.' }, 405);
}

// ==================== Orders ====================
// POST is public (guest checkout, rate limited). GET returns the signed-in
// shopper's own orders, or every order for an admin. PATCH is admin only.
function orderFromRow(row) {
  let data = {};
  try {
    data = JSON.parse(row.data);
  } catch {
    /* ignore malformed row contents */
  }
  return { ...data, id: row.id, status: row.status };
}

async function handleOrders(request, env, url) {
  const match = url.pathname.match(/^\/api\/orders(?:\/([^/]+))?$/);
  const pathId = match && match[1] ? decodeURIComponent(match[1]) : null;

  if (request.method === 'POST' && !pathId) {
    const limitKey = `order:${clientIp(request)}`;
    const count = await getCount(env, limitKey);
    if (count >= 10) return json({ error: 'Too many orders from this network. Try again later.' }, 429);

    const raw = await request.text();
    if (raw.length > MAX_ORDER_BYTES) return json({ error: 'Order too large.' }, 413);
    let order;
    try {
      order = JSON.parse(raw);
    } catch {
      return json({ error: 'Bad request.' }, 400);
    }
    if (!order || typeof order !== 'object' || Array.isArray(order)) return json({ error: 'Bad request.' }, 400);

    const id = clip(order.id, 64) || crypto.randomUUID();
    const email = clip(order.email, 254)?.trim().toLowerCase() || null;
    const customer = customerClaims(request, env);
    await bumpCount(env, limitKey, count, 3600);

    try {
      await env.DB.prepare('INSERT INTO orders (id, user_id, email, status, data) VALUES (?, ?, ?, ?, ?)')
        .bind(id, customer ? customer.u : null, email, 'Processing', JSON.stringify({ ...order, id }))
        .run();
    } catch {
      return json({ error: 'An order with this number already exists.' }, 409);
    }
    return json({ success: true, id }, 201);
  }

  if (request.method === 'GET' && !pathId) {
    if (adminClaims(bearer(request), env)) {
      const { results } = await env.DB.prepare(
        'SELECT id, status, data FROM orders ORDER BY created_at DESC LIMIT 500'
      ).all();
      return json(results.map(orderFromRow));
    }
    const customer = customerClaims(request, env);
    if (!customer) return json({ error: 'Unauthorized.' }, 401);
    // Match on the account id only. Sign-up does not verify email ownership, so
    // matching by email would let anyone read another person's guest orders.
    const { results } = await env.DB.prepare(
      'SELECT id, status, data FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 200'
    ).bind(customer.u).all();
    return json(results.map(orderFromRow));
  }

  if (request.method === 'PATCH' && pathId) {
    const denied = requireAdmin(request, env);
    if (denied) return denied;
    const body = await readJson(request);
    const status = clip(body?.status, 40);
    if (!status) return json({ error: 'Missing status.' }, 400);
    await env.DB.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(status, pathId)
      .run();
    return json({ success: true });
  }

  return json({ error: 'Method not allowed.' }, 405);
}

// ==================== Images ====================
// The browser compresses the image first (Workers have no canvas).
function toBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

async function handleUpload(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  const denied = requireAdmin(request, env);
  if (denied) return denied;

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Bad request.' }, 400);
  }
  const file = form.get('file');
  if (!file || typeof file === 'string') return json({ error: 'No file provided.' }, 400);
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    return json({ error: 'Only JPEG, PNG or WebP images are allowed.' }, 415);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return json({ error: 'Image too large. Compress it to under 1.5 MB first.' }, 413);
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const id = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO images (id, content_type, data) VALUES (?, ?, ?)')
    .bind(id, file.type, toBase64(bytes))
    .run();
  return json({ success: true, publicUrl: `/api/images/${id}` });
}

async function handleImage(request, env, url) {
  const id = url.pathname.split('/').pop();
  const row = await env.DB.prepare('SELECT content_type, data FROM images WHERE id = ?')
    .bind(id)
    .first();
  if (!row) return json({ error: 'Not found.' }, 404);
  const binary = atob(row.data);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new Response(bytes, {
    headers: {
      'Content-Type': row.content_type,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

// ==================== Router ====================
// Dev-only CORS: applies only when the Worker itself is served from localhost
// (wrangler dev) and the calling page is also on localhost. Production is
// same-origin, so no CORS headers are ever added there.
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function devCorsHeaders(request) {
  const host = new URL(request.url).hostname;
  const origin = request.headers.get('Origin') || '';
  if (!['localhost', '127.0.0.1'].includes(host) || !LOCAL_ORIGIN.test(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Cart-Id',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

async function route(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (path === '/api/health') return json({ ok: true });
    if (path === '/api/admin-login') return await handleAdminLogin(request, env);
    if (path === '/api/auth/signup') return await handleSignup(request, env);
    if (path === '/api/auth/login') return await handleCustomerLogin(request, env);
    if (path === '/api/auth/session') return await handleSession(request, env);
    if (path === '/api/products' || path.startsWith('/api/products/')) {
      return await handleProducts(request, env, url);
    }
    if (path === '/api/cart' || path === '/api/cart/add') return await handleCart(request, env, url);
    if (path === '/api/orders' || path.startsWith('/api/orders/')) {
      return await handleOrders(request, env, url);
    }
    if (path === '/api/upload') return await handleUpload(request, env);
    if (path.startsWith('/api/images/')) return await handleImage(request, env, url);

    if (path.startsWith('/api/')) return json({ error: 'Not found.' }, 404);

    // Everything else is the React site
    return env.ASSETS.fetch(request);
  } catch (err) {
    console.error('Unhandled error:', err && err.stack ? err.stack : err);
    return json({ error: 'Server error.' }, 500);
  }
}

export default {
  async fetch(request, env) {
    const cors = devCorsHeaders(request);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors || {} });
    }
    const response = await route(request, env);
    if (!cors) return response;
    const withCors = new Response(response.body, response);
    for (const [key, value] of Object.entries(cors)) withCors.headers.set(key, value);
    return withCors;
  },
};
