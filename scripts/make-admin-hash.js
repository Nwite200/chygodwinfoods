#!/usr/bin/env node
'use strict';

// Local scrypt password hasher for the Chygodwin Admin Console.
// Usage: node scripts/make-admin-hash.js   (type the password when prompted)
// Prints: <saltHex>:<hashHex>  — paste into the ADMIN_PASSWORD_HASH env var
// (Cloudflare Pages: Pages → Settings → Environment variables → Add a variable).
// Same params as functions/api/admin-login.js — do not change one side only.

import { randomBytes, scrypt } from 'node:crypto';
import * as readline from 'node:readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Type your admin password: ', (password) => {
  if (!password) {
    console.error('Empty password — nothing generated.');
    rl.close();
    return;
  }
  const salt = randomBytes(16);
  scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, hash) => {
    if (err) {
      console.error('Hash error:', err.message);
      rl.close();
      return;
    }
    // Format: saltHex:hashHex (salt is not a secret; it is needed at login).
    console.log('');
    console.log('Set this in Netlify (Site settings → Environment variables):');
    console.log(`ADMIN_PASSWORD_HASH=${salt.toString('hex')}:${hash.toString('hex')}`);
    rl.close();
  });
});
