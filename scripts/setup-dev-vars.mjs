// Usage (run in your project folder, next to wrangler.toml):
//   node setup-dev-vars.mjs 'your new password'
// Creates .dev.vars with a new password hash and a fresh random TOKEN_SECRET.
// Overwrites an existing .dev.vars. Prints no secrets.
import { randomBytes, scryptSync } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Give a password of at least 12 characters, in single quotes:");
  console.error("  node setup-dev-vars.mjs 'your new password'");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
const secret = randomBytes(32).toString('hex');

const contents =
  '# Local-only secrets for `wrangler dev`. Keep out of git.\n' +
  '# ADMIN_EMAIL comes from wrangler.toml, so do not define it here.\n' +
  `ADMIN_PASSWORD_HASH=${salt.toString('hex')}:${hash.toString('hex')}\n` +
  `TOKEN_SECRET=${secret}\n`;

writeFileSync('.dev.vars', contents, { mode: 0o600 });
console.log('Wrote .dev.vars (password hash + new TOKEN_SECRET).');
console.log('Next: restart `wrangler dev` and log in with your admin email and that password.');
