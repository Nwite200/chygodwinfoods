// functions/api/admin-login.js
// Cloudflare Pages Function — server-side admin login with scrypt + rate limiting.
// Route: POST /api/admin-login
// Credentials come from Cloudflare Pages environment variables:
//   ADMIN_EMAIL, ADMIN_PASSWORD_HASH  (set in Pages → Settings → Environment variables)
// Rate-limit counters live in Cloudflare KV:
//   ADMIN_LIMITS_KV  (bind a KV namespace in Pages → Settings → Functions → KV)
// Generate the hash locally:  node scripts/make-admin-hash.js
import { scrypt, timingSafeEqual, createHash, createHmac } from 'node:crypto';

const MAX_FAILS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 };
const SESSION_MS = 8 * 60 * 60 * 1000;
const GENERIC_ERROR = 'Invalid email or password.';

const hashKey = (s) => createHash('sha256').update(String(s)).digest('hex').slice(0, 32);

const derive = (password, saltBuf) =>
  new Promise((resolve, reject) => {
    scrypt(password, saltBuf, 64, SCRYPT_OPTS, (err, dk) => (err ? reject(err) : resolve(dk)));
  });

const mem = new Map();

const readKV = async (kv, key) => {
  try {
    if (kv) {
      const raw = await kv.get(key);
      if (!raw) return null;
      const rec = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Date.now() > rec.until ? null : rec;
    }
  } catch { /* best effort */ }
  const cached = mem.get(key);
  if (!cached) return null;
  const rec = typeof cached === 'string' ? JSON.parse(cached) : cached;
  return Date.now() > rec.until ? null : rec;
};

const writeKV = async (kv, key, rec) => {
  try {
    if (kv) {
      await kv.put(key, JSON.stringify(rec));
    } else {
      mem.set(key, JSON.stringify(rec));
    }
  } catch { /* best effort */ }
};

const clearKV = async (kv, key) => {
  try {
    if (kv) {
      await kv.delete(key);
    } else {
      mem.delete(key);
    }
  } catch { /* best effort */ }
};

export async function onRequestPost(context) {
  const { request, env } = context;
  const kv = env.ADMIN_LIMITS_KV;

  const adminEmail = (env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminHash = (env.ADMIN_PASSWORD_HASH || '').trim();
  if (!adminEmail || !adminHash || !adminHash.includes(':')) {
    return new Response(
      JSON.stringify({ error: 'Admin login is not configured on this deployment. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH.' }),
      { status: 503, headers: { 'content-type': 'application/json' } },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Bad request.' }), { status: 400 });
  }

  const hmacKey = createHash('sha256').update(adminHash).digest();
  const signToken = (email) => {
    const payload = Buffer.from(JSON.stringify({ e: email, x: Date.now() + SESSION_MS })).toString('base64url');
    return `${payload}.${createHmac('sha256', hmacKey).update(payload).digest('hex')}`;
  };
  const verifyToken = (token) => {
    const [payload, sig] = String(token || '').split('.');
    if (!payload || !sig) return null;
    const sigBuf = Buffer.from(sig);
    const expected = Buffer.from(createHmac('sha256', hmacKey).update(payload).digest('hex'));
    if (sigBuf.length !== expected.length || !timingSafeEqual(sigBuf, expected)) return null;
    try {
      const { e, x } = JSON.parse(Buffer.from(payload, 'base64url').toString());
      return x && Date.now() < x ? e : null;
    } catch {
      return null;
    }
  };

  if (body?.action === 'verify') {
    const email = verifyToken(body?.token);
    if (!email) {
      return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'content-type': 'application/json' } });
    }
    return new Response(JSON.stringify({ ok: true, email }), { status: 200, headers: { 'content-type': 'application/json' } });
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  if (!email || !password) {
    return new Response(JSON.stringify({ error: GENERIC_ERROR }), { status: 400 });
  }

  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ipKey = `ip:${hashKey(ip)}`;
  const emailKey = `email:${hashKey(email)}`;

  for (const key of [ipKey, emailKey]) {
    const rec = await readKV(kv, key);
    if (rec?.fails >= MAX_FAILS) {
      return new Response(
        JSON.stringify({ error: `Too many failed attempts. Try again in ${Math.ceil((rec.until - Date.now()) / 60000)} minute(s).` }),
        { status: 429, headers: { 'content-type': 'application/json' } },
      );
    }
  }

  const [saltHex, hashHex] = adminHash.split(':');
  let ok = false;
  try {
    const derived = await derive(password, Buffer.from(saltHex, 'hex'));
    const expected = Buffer.from(hashHex, 'hex');
    ok = expected.length === derived.length && timingSafeEqual(derived, expected) && email === adminEmail;
  } catch {
    ok = false;
  }

  if (!ok) {
    for (const key of [ipKey, emailKey]) {
      const prev = (await readKV(kv, key)) || { fails: 0, until: 0 };
      const fails = prev.fails + 1;
      const until = fails >= MAX_FAILS ? Date.now() + LOCKOUT_MS : Math.max(prev.until, Date.now() + LOCKOUT_MS);
      await writeKV(kv, key, { fails, until });
    }
    return new Response(JSON.stringify({ error: GENERIC_ERROR }), { status: 401 });
  }

  await clearKV(kv, ipKey);
  await clearKV(kv, emailKey);
  return new Response(
    JSON.stringify({ ok: true, email: adminEmail, token: signToken(adminEmail) }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}