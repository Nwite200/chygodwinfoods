import { getStore } from '@netlify/blobs';
import { scrypt, timingSafeEqual, createHash, createHmac } from 'node:crypto';

// Server-side admin login: scrypt verification + per-IP / per-email rate limit.
// Credentials come from env vars (VITE_ names are a temporary fallback until the
// new unprefixed names are confirmed working in Netlify, then remove them).
// Failed-attempt counters live in Netlify Blobs so they survive between runs.
const MAX_FAILS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 };
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hour admin session
const GENERIC_ERROR = 'Invalid email or password.'; // same for wrong email + wrong password

const hashKey = (s) => createHash('sha256').update(String(s)).digest('hex').slice(0, 32);

const derive = (password, saltBuf) =>
  new Promise((resolve, reject) => {
    scrypt(password, saltBuf, 64, SCRYPT_OPTS, (err, dk) => (err ? reject(err) : resolve(dk)));
  });

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405 });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
  const adminHash = (process.env.ADMIN_PASSWORD_HASH || process.env.VITE_ADMIN_PASSWORD_HASH || '').trim();
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

  // Session tokens are HMAC-signed with a key derived from the password hash
  // (server-only) — the browser stores the token but cannot forge one.
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

  // Session check (page load with an existing token) — no password involved.
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

  const ip = request.headers.get('x-nf-client-connection-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ipKey = `ip:${hashKey(ip)}`;
  const emailKey = `email:${hashKey(email)}`;

  // Blobs store; in-memory fallback keeps local/dev testing working.
  const mem = (globalThis.__adminLimitMem ??= new Map());
  const store = (() => {
    try {
      return getStore('admin-login-limits');
    } catch {
      return null;
    }
  })();
  const read = async (key) => {
    try {
      const raw = store ? await store.get(key) : mem.get(key);
      if (!raw) return null;
      const rec = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Date.now() > rec.until ? null : rec; // expired = clean slate
    } catch {
      return null;
    }
  };
  const write = async (key, rec) => {
    try {
      if (store) await store.setJSON(key, rec);
      else mem.set(key, JSON.stringify(rec));
    } catch { /* best effort */ }
  };
  const clear = async (key) => {
    try {
      if (store) await store.delete(key);
      mem.delete(key);
    } catch { /* best effort */ }
  };

  // Enforce lockout per IP AND per email before checking credentials.
  for (const key of [ipKey, emailKey]) {
    const rec = await read(key);
    if (rec?.fails >= MAX_FAILS) {
      return new Response(
        JSON.stringify({ error: `Too many failed attempts. Try again in ${Math.ceil((rec.until - Date.now()) / 60000)} minute(s).` }),
        { status: 429, headers: { 'content-type': 'application/json' } },
      );
    }
  }

  // scrypt verify — timing-safe; same work whether the email matches or not.
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
      const prev = (await read(key)) || { fails: 0, until: 0 };
      const fails = prev.fails + 1;
      const until = fails >= MAX_FAILS ? Date.now() + LOCKOUT_MS : Math.max(prev.until, Date.now() + LOCKOUT_MS);
      await write(key, { fails, until });
    }
    return new Response(JSON.stringify({ error: GENERIC_ERROR }), { status: 401 });
  }

  // Successful login resets both counters and issues a signed session token.
  await clear(ipKey);
  await clear(emailKey);
  return new Response(
    JSON.stringify({ ok: true, email: adminEmail, token: signToken(adminEmail) }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
};

export const config = { path: '/api/admin-login' };
