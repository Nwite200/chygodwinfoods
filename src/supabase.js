/**
 * Cloudflare Workers API replacement for Supabase client
 * 
 * This file provides the same API interface as supabase-js but calls
 * the Cloudflare Worker instead of directly connecting to Supabase.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

/**
 * Product API calls - replaces supabase.from('app_products')
 */
export const productApi = {
  /** Get all products */
  async getAll() {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  /** Insert or update a product */
  async upsert(productData) {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upsert product');
    }
    return response.json();
  },

  /** Delete a product */
  async delete(id) {
    const response = await fetch(`${BASE_URL}/api/products?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }
    return response.json();
  },
};

/**
 * Cart API calls - replaces supabase.from('cart_items')
 */
export const cartApi = {
  /** Get cart items for a user */
  async getItems(userId = 'anonymous') {
    const response = await fetch(`${BASE_URL}/api/cart?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch cart items');
    return response.json();
  },

  /** Insert or update a cart item */
  async upsertItem(userId, productId, quantity = 1) {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update cart item');
    }
    return response.json();
  },

  /** Delete a cart item */
  async deleteItem(userId, productId) {
    const response = await fetch(`${BASE_URL}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete cart item');
    }
    return response.json();
  },
};

/**
 * Auth API - replaces supabase.auth
 */
export const authApi = {
  /** Check if user is authenticated */
  async getSession() {
    // In a real implementation, this would verify a JWT token
    // For now, check if we have a session in localStorage
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    // Store session in localStorage
    localStorage.setItem('chygodwin_session', JSON.stringify({ email, expires: Date.now() + 8 * 60 * 60 * 1000 }));
    return { data, error: null };
  },

  /** Sign out */
  async signOut() {
    localStorage.removeItem('chygodwin_session');
    return { data: { session: null }, error: null };
  },

  /** Listen for auth state changes */
  onAuthStateChange(callback) {
    // Check initial state
    const initialSession = this.getSession();
    callback(initialSession.event, initialSession.data.session);
    
    // Return unsubscribe function (no-op for now)
    return () => {};
  },
};

/**
 * Main supabase-like object that matches the Supabase client interface
 * used in the codebase, but calls our Cloudflare Worker API instead.
 */
export const supabase = {
  // Product operations - replaces supabase.from('app_products')
  from: (table) => {
    if (table === 'app_products') return productApi;
    if (table === 'cart_items') return cartApi;
    throw new Error(`Table ${table} not supported`);
  },

  // Auth operations - replaces supabase.auth
  auth: authApi,

  // Simulated isSupabaseConfigured
  // In production, this would check if the Cloudflare Worker is deployed
  get isSupabaseConfigured() {
    return true; // Always configured - Cloudflare Worker is always available
  },
};

/** Named export for isSupabaseConfigured */
export const isSupabaseConfigured = true;

/** Initialize the app with Cloudflare Worker support */
export function initCloudflareApp() {

/**
/** Named export for isSupabaseConfigured */
export const isSupabaseConfigured = true;
 * Initialize the app with Cloudflare Worker support
 * Call this instead of the Supabase initialization
 */
export function initCloudflareApp() {
  // The supabase object is already set up above
  // Any code that previously used supabase.from('table') 
  // can now use supabase.from('table')
  
  console.log('ChyGodwin app initialized with Cloudflare Worker API');
}