// Usage: node check-login.js "email you type in the login form" 'password you type'
// Run it from the project folder. Reads .dev.vars and wrangler.toml, prints only true/false.
import { readFileSync, existsSync } from 'node:fs';
import { scryptSync, timingSafeEqual } from 'node:crypto';

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node check-login.js \"email\" 'password'");
  process.exit(1);
}

function parseEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return null;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

const dev = parseEnvFile('.dev.vars');
const toml = existsSync('wrangler.toml') ? readFileSync('wrangler.toml', 'utf8') : '';
const tomlEmail = (toml.match(/^\s*ADMIN_EMAIL\s*=\s*"([^"]*)"/m) || [])[1];

console.log('.dev.vars found:                    ', dev !== null);
if (!dev) process.exit(0);

console.log('.dev.vars defines ADMIN_EMAIL:      ', 'ADMIN_EMAIL' in dev, '(it would override the toml)');
console.log('.dev.vars defines TOKEN_SECRET:     ', Boolean(dev.TOKEN_SECRET));

const effectiveEmail = (dev.ADMIN_EMAIL ?? tomlEmail ?? '').trim().toLowerCase();
console.log('Effective ADMIN_EMAIL the Worker uses:', JSON.stringify(effectiveEmail));
console.log('Typed email matches it:             ', effectiveEmail === email.trim().toLowerCase());

const hash = dev.ADMIN_PASSWORD_HASH || '';
const [saltHex, hashHex] = hash.split(':');
const formatOk = /^[0-9a-f]+$/i.test(saltHex || '') && /^[0-9a-f]{128}$/i.test(hashHex || '');
console.log('ADMIN_PASSWORD_HASH format is valid: ', formatOk);

if (formatOk) {
  const derived = scryptSync(password, Buffer.from(saltHex, 'hex'), 64, { N: 16384, r: 8, p: 1 });
  const expected = Buffer.from(hashHex, 'hex');
  console.log('Password matches the hash:          ', derived.length === expected.length && timingSafeEqual(derived, expected));
}
