// ChyGodwin Foods API - Cloudflare Worker (D1 + KV + static assets)
//
// Secrets (never commit): ADMIN_PASSWORD_HASH, TOKEN_SECRET
// Vars (wrangler.toml):   ADMIN_EMAIL
// Bindings:               DB (D1), ADMIN_LIMITS_KV (KV), ASSETS (static site)

import { scrypt, timingSafeEqual, createHmac } from 'node:crypto';

// ==================== Helpers ====================
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_SECONDS = 15 * 60;
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

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

// ==================== Token signing / verification ====================
function signToken(email, secret) {
  const payload = Buffer.from(
    JSON.stringify({ e: email, x: Date.now() + TOKEN_TTL_MS })
  ).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyToken(token, secret) {
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

// Returns null when authorised, or a Response to send back.
function requireAdmin(request, env) {
  if (!env.TOKEN_SECRET || !env.ADMIN_EMAIL) {
    return json({ error: 'Admin is not configured on this deployment.' }, 503);
  }
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const data = verifyToken(token, env.TOKEN_SECRET);
  if (!data || String(data.e).toLowerCase() !== env.ADMIN_EMAIL.trim().toLowerCase()) {
    return json({ error: 'Unauthorized.' }, 401);
  }
  return null;
}

// ==================== Admin login ====================
async function handleAdminLogin(request, env) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const hash = env.ADMIN_PASSWORD_HASH;
  if (!env.ADMIN_EMAIL || !hash || !hash.includes(':') || !env.TOKEN_SECRET) {
    return json({ error: 'Admin login is not configured on this deployment.' }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request.' }, 400);
  }

  // Session check used by the admin page after a refresh: { action: 'verify', token }
  if (body?.action === 'verify') {
    const data = verifyToken(body.token, env.TOKEN_SECRET);
    if (!data || String(data.e).toLowerCase() !== env.ADMIN_EMAIL.trim().toLowerCase()) {
      return json({ ok: false }, 401);
    }
    return json({ ok: true, email: data.e });
  }

  // Brute-force limiter (per IP, stored in KV)
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const limitKey = `login-fail:${ip}`;
  let fails = 0;
  if (env.ADMIN_LIMITS_KV) {
    fails = parseInt((await env.ADMIN_LIMITS_KV.get(limitKey)) || '0', 10);
    if (fails >= MAX_FAILED_LOGINS) {
      return json({ error: 'Too many attempts. Try again later.' }, 429);
    }
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  if (!email || !password) return json({ error: 'Invalid email or password.' }, 400);

  let ok = false;
  try {
    const [saltHex, hashHex] = hash.split(':');
    const derived = await deriveKey(password, Buffer.from(saltHex, 'hex'));
    const expected = Buffer.from(hashHex, 'hex');
    const passOk = expected.length === derived.length && timingSafeEqual(derived, expected);
    const emailOk = safeEqual(email, env.ADMIN_EMAIL.trim().toLowerCase());
    ok = passOk && emailOk;
  } catch {
    ok = false;
  }

  if (!ok) {
    if (env.ADMIN_LIMITS_KV) {
      await env.ADMIN_LIMITS_KV.put(limitKey, String(fails + 1), {
        expirationTtl: LOCKOUT_SECONDS,
      });
    }
    return json({ error: 'Invalid email or password.' }, 401);
  }

  if (env.ADMIN_LIMITS_KV) await env.ADMIN_LIMITS_KV.delete(limitKey);
  const token = signToken(email, env.TOKEN_SECRET);
  return json({ ok: true, email, token });
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
// Public. Each browser sends its own X-Cart-Id so carts are not shared.
function cartOwner(request) {
  const id = request.headers.get('X-Cart-Id') || '';
  return /^[\w-]{8,64}$/.test(id) ? id : 'anonymous';
}

async function handleCart(request, env) {
  const userId = cartOwner(request);

  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT product_id, quantity FROM cart_items WHERE user_id = ?'
    ).bind(userId).all();
    return json(results);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Bad request.' }, 400);
  }
  const productId = String(body.productId || '');
  if (!productId) return json({ error: 'Missing productId.' }, 400);

  if (request.method === 'POST') {
    const quantity = Math.max(1, Math.min(999, parseInt(body.quantity, 10) || 1));
    await env.DB.prepare(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = excluded.quantity`
    ).bind(userId, productId, quantity).run();
    return json({ success: true });
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?'
    ).bind(userId, productId).run();
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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
      if (path === '/api/products' || path.startsWith('/api/products/')) {
        return await handleProducts(request, env, url);
      }
      if (path === '/api/cart') return await handleCart(request, env);
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
