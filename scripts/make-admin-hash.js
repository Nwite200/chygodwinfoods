#!/usr/bin/env node
'use strict';

// Local scrypt password hasher for the Chygodwin Admin Console.
// Usage: node scripts/make-admin-hash.js
// Prints: <saltHex>:<hashHex>  (drop this into ADMIN_PASSWORD_HASH.)
'use strict';

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Type your admin password: ', (password) => {
  const salt = crypto.randomBytes(16);
  crypto.scrypt(password, salt, 64, { N: 65536, r: 8, p: 1 }, (err, hash) => {
    if (err) {
      console.error('Hash error:', err.message);
      rl.close();
      return;
    }
    // Format: saltHex:hashHex (salt is not a secret; it is needed at login).
    console.log('ADMIN_PASSWORD_HASH=<saltHex>:<hashHex>');
    console.log(`${salt.toString('hex')}:${hash.toString('hex')}`);
    rl.close();
  });
});
