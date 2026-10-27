/**
 * Cloudflare Workers API adapter that mimics the small part of the
 * supabase-js interface this app uses (see App.jsx).
 *
 * All calls are same-origin (`/api/...`) unless VITE_API_BASE_URL is set.
 * In dev, vite.config.js proxies /api to `wrangler dev` on port 8787.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const BASE_URL = API_BASE_URL;

/** Same key AdminView.jsx stores the signed admin token under. */
export const ADMIN_TOKEN_KEY = 'chygodwin_admin_token';

/** Authorization header for admin-only calls (empty when not signed in). */
export function adminAuthHeaders() {
  try {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

const hasAdminToken = () => Boolean(adminAuthHeaders().Authorization);

async function readError(response, fallback) {
  const body = await response.json().catch(() => ({}));
  return new Error(body.error || fallback);
}

/**
 * Product API - replaces supabase.from('app_products')
 */
export const productApi = {
  /** Get all products (plain product objects) */
  async getAll() {
    const response = await fetch(`${BASE_URL}/api/products`);
    if (!response.ok) throw await readError(response, 'Failed to fetch products');
    return response.json();
  },

  /**
   * supabase-style select: resolves to { data: [{ id, data: product }], error }
   * App.jsx reads `data.map((row) => row.data)`.
   */
  async select() {
    try {
      const response = await fetch(`${BASE_URL}/api/products`);
      if (!response.ok) throw await readError(response, 'Failed to load products');
      const products = await response.json();
      return { data: products.map((p) => ({ id: p.id, data: p })), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Insert or update products. Accepts the rows App.jsx sends ({ id, data })
   * or plain product objects, one or many. Only signed-in admins can write,
   * so for everyone else this is a no-op.
   */
  async upsert(rows) {
    if (!hasAdminToken()) return { data: null, error: null };
    try {
      const list = (Array.isArray(rows) ? rows : [rows]).map((row) => {
        const product = row && typeof row.data === 'object' && row.data ? row.data : row;
        return { ...product, id: product.id ?? row.id };
      });
      for (let i = 0; i < list.length; i += 100) {
        const response = await fetch(`${BASE_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
          body: JSON.stringify(list.slice(i, i + 100)),
        });
        if (!response.ok) throw await readError(response, 'Failed to save products');
      }
      return { data: list, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /** Delete a product (admin only) */
  async delete(id) {
    if (!hasAdminToken()) return { data: null, error: null };
    try {
      const response = await fetch(`${BASE_URL}/api/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: adminAuthHeaders(),
      });
      if (!response.ok) throw await readError(response, 'Failed to delete product');
      return { data: { id }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};

/**
 * Cart API - replaces supabase.from('cart_items')
 * The Worker keeps one cart per X-Cart-Id header.
 */
const cartHeaders = (userId) => ({
  'Content-Type': 'application/json',
  ...(userId ? { 'X-Cart-Id': String(userId) } : {}),
});

export const cartApi = {
  /** Get cart items for a user */
  async getItems(userId = 'anonymous') {
    const response = await fetch(`${BASE_URL}/api/cart`, { headers: cartHeaders(userId) });
    if (!response.ok) throw await readError(response, 'Failed to fetch cart items');
    return response.json();
  },

  /** Insert or update a cart item */
  async upsertItem(userId, productId, quantity = 1) {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: cartHeaders(userId),
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) throw await readError(response, 'Failed to update cart item');
    return response.json();
  },

  /** Delete a cart item */
  async deleteItem(userId, productId) {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      method: 'DELETE',
      headers: cartHeaders(userId),
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) throw await readError(response, 'Failed to delete cart item');
    return response.json();
  },

  /** Select cart items - returns items for a user */
  async select(userId = 'anonymous') {
    return this.getItems(userId);
  },
};

/**
 * Auth API - replaces supabase.auth
 * (The admin console signs in through its own call to /api/admin-login.)
 */
export const authApi = {
  /** Check if user is authenticated */
  async getSession() {
    const session = localStorage.getItem('chygodwin_session');
    if (session) {
      return { data: { session: JSON.parse(session) }, error: null };
    }
    return { data: { session: null }, error: null };
  },

  /** Sign in with email/password (admin) */
  async signIn(email, password) {
    const response = await fetch(`${BASE_URL}/api/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw await readError(response, 'Login failed');
    const data = await response.json();
    try {
      if (data.token) sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    } catch {
      // ignore
    }
    localStorage.setItem('chygodwin_session', JSON.stringify({ email, expires: Date.now() + 8 * 60 * 60 * 1000 }));
    return { data, error: null };
  },

  /** Sign out */
  async signOut() {
    localStorage.removeItem('chygodwin_session');
    try {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // ignore
    }
    return { data: { session: null }, error: null };
  },

  /** Listen for auth state changes */
  onAuthStateChange(callback) {
    this.getSession().then((initialSession) => {
      callback('INITIAL_SESSION', initialSession?.data?.session ?? null);
    }).catch(() => {
      callback('INITIAL_SESSION', null);
    });

    // Return unsubscribe object matching Supabase client shape
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
};

/**
 * Main supabase-like object that matches the Supabase client interface
 * used in the codebase, but calls our Cloudflare Worker API instead.
 */
export const supabase = {
  from: (table) => {
    if (table === 'app_products') return productApi;
    if (table === 'cart_items') return cartApi;
    throw new Error(`Table ${table} not supported`);
  },

  auth: authApi,

  get isSupabaseConfigured() {
    return true;
  },
};

/** Named export for isSupabaseConfigured */
export const isSupabaseConfigured = true;

/** Initialize the app with Cloudflare Worker support */
export function initCloudflareApp() {
}
