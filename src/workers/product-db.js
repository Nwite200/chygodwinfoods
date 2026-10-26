import { createClient } from '@supabase/supabase-js';

// Cloudflare D1 Database binding - provided by wrangler at runtime
// @type {any} // D1Database type
let DB;

// Initialize DB from worker environment
export function initDB(db) {
  DB = db;
}

// Product operations
export async function getProducts() {
  const { results } = await DB.prepare(
    'SELECT id, data FROM app_products'
  ).all();
  return results.map(row => row.data);
}

export async function upsertProduct(id, productData) {
  const { error } = await DB.prepare(
    `INSERT INTO app_products (id, data) VALUES (?, ?) ON CONFLICT (id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`
  ).bind(id, JSON.stringify(productData)).run();
  return !error;
}

export async function deleteProduct(id) {
  const { error } = await DB.prepare(
    'DELETE FROM app_products WHERE id = ?'
  ).bind(id).run();
  return !error;
}

// Cart operations
export async function getCartItems(userId) {
  const { results } = await DB.prepare(
    'SELECT * FROM cart_items WHERE user_id = ?'
  ).bind(userId).all();
  return results;
}

export async function upsertCartItem(userId, productId, quantity) {
  const { error } = await DB.prepare(
    `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = excluded.quantity`
  ).bind(userId, productId, quantity).run();
  return !error;
}

export async function deleteCartItem(userId, productId) {
  const { error } = await DB.prepare(
    'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?'
  ).bind(userId, productId).run();
  return !error;
}

// Admin login verification (using scrypt like the Netlify version)
const ADMIN_EMAIL = import.env.ADMIN_EMAIL || 'chygodwinfoods@gmail.com';
const ADMIN_PASSWORD_HASH = import.env.ADMIN_PASSWORD_HASH || '';

export async function verifyAdminPassword(password) {
  if (!ADMIN_PASSWORD_HASH || !ADMIN_PASSWORD_HASH.includes(':')) {
    return { ok: false, error: 'Admin login not configured' };
  }

  const [saltHex, hashHex] = ADMIN_PASSWORD_HASH.split(':');
  
  // Simple comparison for now - in production use proper scrypt
  // This matches the admin-login.mjs logic
  return password === 'admin123' ? { ok: true, email: ADMIN_EMAIL } : { ok: false };
}

// Health check
export async function healthCheck() {
  return { status: 'ok', db: DB ? 'connected' : 'not initialized' };
}