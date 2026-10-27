// Cloudflare Worker - ChyGodwin Foods API
// Replace Supabase with D1 Workers and API routes

import { createClient } from '@supabase/supabase-js';

// ==================== Configuration ====================
const ADMIN_EMAIL = 'chygodwinfoods@gmail.com';
const ADMIN_PASSWORD_HASH = 'a1cc34df791b1b48371292a73545297db5072e1ad90697f4a2a6d44f6783a5b9:35e2fa8261058af6d201246b009f4b96c768d7fedba4d8bf2942d2f472446ce6';

// ==================== D1 Database ====================
let DB;

export function initDB(db) {
  DB = db;
}

// ==================== Main Route Handler ====================
export async function handleRequest(request) {
  const url = new URL(request.url);

  // Route based on path
  if (url.pathname === '/api/products') {
    return handleProducts(request);
  }
  if (url.pathname === '/api/cart') {
    return handleCart(request);
  }
  if (url.pathname === '/api/upload') {
    return handleUpload(request);
  }

  return new Response('Not found', { status: 404 });
}

// ==================== Product API ====================
export async function handleProducts(request) {
  if (request.method === 'GET') {
    const { results } = await DB.prepare(
      'SELECT id, data FROM app_products'
    ).all();
    return new Response(JSON.stringify(results.map(row => row.data)), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.method === 'POST') {
    const productData = await request.json();
    const id = crypto.randomUUID();
    const { error } = await DB.prepare(
      `INSERT INTO app_products (id, data) VALUES (?, ?) ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`
    ).bind(id, JSON.stringify(productData)).run();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response('Not found', { status: 404 });
}

// ==================== Image Upload API ====================
export async function handleUpload(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const bytes = await file.arrayBuffer();
  const blob = new Blob([bytes], { type: file.type });

  // Compress the image using canvas (max 800px wide, JPEG 70%)
  const img = new Image();
  const url = URL.createObjectURL(blob);
  img.src = url;

  await new Promise((resolve) => { img.onload = resolve; });

  const canvas = document.createElement('canvas');
  const maxW = 800;
  const scale = Math.min(1, maxW / img.width);
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

  const compressedBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.7)
  );
  URL.revokeObjectURL(url);

  if (!compressedBlob) {
    return new Response(JSON.stringify({ error: 'Could not compress image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Convert to base64 or store in D1 - for now return as base64
  const arrayBuffer = await compressedBlob.arrayBuffer();
  const base64 = btoa(
    ...new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
  const publicUrl = `/products/${Date.now()}.jpg?r=${Math.random()}`;

  return new Response(
    JSON.stringify({ success: true, publicUrl, base64 }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// ==================== Cart API ====================
export async function handleCart(request) {
  const userId = 'anonymous'; // In real app, get from auth

  if (request.method === 'GET') {
    const { results } = await DB.prepare(
      'SELECT * FROM cart_items WHERE user_id = ?'
    ).bind(userId).all();
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.method === 'POST') {
    const { productId, quantity } = await request.json();
    const { error } = await DB.prepare(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = excluded.quantity`
    ).bind(userId, productId, quantity).run();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (request.method === 'DELETE') {
    const { productId } = await request.json();
    const { error } = await DB.prepare(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?'
    ).bind(userId, productId).run();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response('Not found', { status: 404 });
}

// ==================== Admin Login ====================
function hashKey(s) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(String(s)).digest('hex').slice(0, 32);
}

function derive(password, saltBuf) {
  return new Promise((resolve, reject) => {
    const crypto = require('crypto');
    crypto.scrypt(password, saltBuf, 64, { N: 16384, r: 8, p: 1 }, (err, dk) => {
      if (err) reject(err);
      else resolve(dk);
    });
  });
}

// ==================== Admin Login Handler ====================
export async function handleAdminLogin(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const adminEmail = ADMIN_EMAIL;
  const adminHash = ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash || !adminHash.includes(':')) {
    return new Response(JSON.stringify({ error: 'Admin login is not configured on this deployment.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Bad request.' }), { status: 400 });
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Invalid email or password.' }), { status: 400 });
  }

  // scrypt verify
  const [saltHex, hashHex] = adminHash.split(':');
  let ok = false;
  try {
    const derived = await derive(password, Buffer.from(saltHex, 'hex'));
    const expected = Buffer.from(hashHex, 'hex');
    ok = expected.length === derived.length && 
         crypto.timingSafeEqual(derived, expected) && 
         email === adminEmail;
  } catch {
    ok = false;
  }

  if (!ok) {
    return new Response(JSON.stringify({ error: 'Invalid email or password.' }), { status: 401 });
  }

  // Successful login - issue a session token
  const hmacKey = crypto.createHash('sha256').update(adminHash).digest();
  const signToken = (email) => {
    const payload = Buffer.from(JSON.stringify({ e: email, x: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
    return `${payload}.${crypto.createHmac('sha256', hmacKey).update(payload).digest('hex')}`;
  };

  const token = signToken(email);
  return new Response(JSON.stringify({ ok: true, email: adminEmail, token }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ==================== Main Fetch Handler ====================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Initialize DB from env if not already done
    if (!DB && env.DB) {
      DB = env.DB;
    }

    // Route handlers
    if (path === '/api/products') {
      return handleProducts(request);
    }
    if (path === '/api/cart') {
      return handleCart(request);
    }
    if (path === '/api/admin-login') {
      return handleAdminLogin(request);
    }
    if (path === '/api/health') {
      return handleHealth();
    }

    // For React Router - return JSON API error for non-API routes
    if (path !== '/' && !path.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    return new Response('Not found', { status: 404 });
  },
};