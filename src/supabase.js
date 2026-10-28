/**
 * Cloudflare Workers API adapter that mimics the small part of the
 * supabase-js interface this app uses (see App.jsx), so the app code did not
 * have to change when the backend moved from Supabase to Cloudflare.
 *
 * All calls are same-origin (`/api/...`) unless VITE_API_BASE_URL is set.
 * In dev, vite.config.js proxies /api to `wrangler dev` on port 8787.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const BASE_URL = API_BASE_URL;

/** Admin token (sessionStorage) is stored by AdminView.jsx after /api/admin-login. */
export const ADMIN_TOKEN_KEY = 'chygodwin_admin_token';
/** Shopper token (localStorage) is stored here after sign-in or sign-up. */
export const CUSTOMER_TOKEN_KEY = 'chygodwin_customer_token';

function readToken(storage, key) {
  try {
    return storage.getItem(key) || '';
  } catch {
    return '';
  }
}

/** Authorization header for admin-only calls (empty when not signed in). */
export function adminAuthHeaders() {
  const token = readToken(sessionStorage, ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function customerAuthHeaders() {
  const token = readToken(localStorage, CUSTOMER_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
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
 * Cart API - replaces supabase.from('cart_items').
 * Supports the chained calls App.jsx makes (.select().eq().order(), .upsert(),
 * .update().eq().eq(), .delete().eq()). The Worker decides whose cart it is from
 * the shopper's token, so the user_id filters are ignored on the server.
 */
function cartQuery() {
  const state = { op: 'select', filters: {}, payload: null };

  const run = async () => {
    const headers = { 'Content-Type': 'application/json', ...customerAuthHeaders() };
    try {
      let response;
      if (state.op === 'select') {
        response = await fetch(`${BASE_URL}/api/cart`, { headers });
        if (!response.ok) throw await readError(response, 'Failed to load cart');
        return { data: await response.json(), error: null };
      }
      if (state.op === 'upsert') {
        const rows = Array.isArray(state.payload) ? state.payload : [state.payload];
        const items = rows.map((r) => ({
          productId: r.product_id,
          productName: r.product_name,
          productImage: r.product_image,
          price: r.price,
          quantity: r.quantity,
        }));
        response = await fetch(`${BASE_URL}/api/cart`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ items }),
        });
      } else if (state.op === 'update') {
        response = await fetch(`${BASE_URL}/api/cart`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ productId: state.filters.product_id, quantity: state.payload?.quantity }),
        });
      } else if (state.filters.product_id) {
        response = await fetch(`${BASE_URL}/api/cart`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ productId: state.filters.product_id }),
        });
      } else {
        response = await fetch(`${BASE_URL}/api/cart?all=1`, { method: 'DELETE', headers });
      }
      if (!response.ok) throw await readError(response, 'Failed to update cart');
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const builder = {
    select() { return builder; },
    eq(column, value) { state.filters[column] = value; return builder; },
    order() { return builder; },
    upsert(rows) { state.op = 'upsert'; state.payload = rows; return builder; },
    update(values) { state.op = 'update'; state.payload = values; return builder; },
    delete() { state.op = 'delete'; return builder; },
    then(resolve, reject) { return run().then(resolve, reject); },
  };
  return builder;
}

/** supabase.rpc('add_cart_item', ...) -> atomic "add one" on the Worker */
async function rpc(name, params = {}) {
  if (name !== 'add_cart_item') {
    return { data: null, error: new Error(`Unknown function ${name}`) };
  }
  try {
    const response = await fetch(`${BASE_URL}/api/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...customerAuthHeaders() },
      body: JSON.stringify({
        productId: params.p_product_id,
        productName: params.p_product_name,
        productImage: params.p_product_image,
        price: params.p_price,
      }),
    });
    if (!response.ok) throw await readError(response, 'Failed to update cart');
    return { data: await response.json(), error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/** Realtime is not used any more; this keeps the old call sites harmless. */
function channel() {
  const stub = {
    on() { return stub; },
    subscribe() { return stub; },
    unsubscribe() { return Promise.resolve('ok'); },
  };
  return stub;
}

/**
 * Auth API - replaces supabase.auth for shoppers (email + password).
 */
const authListeners = new Set();

function toSession(token, user) {
  return {
    access_token: token,
    user: { id: user.id, email: user.email, user_metadata: { name: user.name || '' } },
  };
}

function emitAuth(event, session) {
  authListeners.forEach((callback) => {
    try {
      callback(event, session);
    } catch {
      // a broken listener must not stop the others
    }
  });
}

async function authRequest(path, body) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw await readError(response, 'Request failed. Please try again.');
    const data = await response.json();
    try {
      localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
    } catch {
      // storage blocked: the session lasts until the page closes
    }
    const session = toSession(data.token, data.user);
    emitAuth('SIGNED_IN', session);
    return { data: { user: session.user, session }, error: null };
  } catch (error) {
    return { data: { user: null, session: null }, error };
  }
}

export const authApi = {
  /** Resolve the current shopper session (checks the token with the Worker). */
  async getSession() {
    const token = readToken(localStorage, CUSTOMER_TOKEN_KEY);
    if (!token) return { data: { session: null }, error: null };
    try {
      const response = await fetch(`${BASE_URL}/api/auth/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        try {
          localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        } catch {
          // ignore
        }
        return { data: { session: null }, error: null };
      }
      if (!response.ok) throw await readError(response, 'Unable to check your sign-in status.');
      const { user } = await response.json();
      return { data: { session: toSession(token, user) }, error: null };
    } catch (error) {
      return { data: { session: null }, error };
    }
  },

  signUp({ email, password, options } = {}) {
    return authRequest('/api/auth/signup', { email, password, name: options?.data?.name });
  },

  signInWithPassword({ email, password } = {}) {
    return authRequest('/api/auth/login', { email, password });
  },

  /** Google sign-in is not offered on the Cloudflare version. */
  async signInWithOAuth() {
    return { data: null, error: new Error('Google sign-in is not available. Please use your email and password.') };
  },

  async signOut() {
    try {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    } catch {
      // ignore
    }
    emitAuth('SIGNED_OUT', null);
    return { error: null };
  },

  /** Listen for sign-in / sign-out. Returns an object shaped like supabase-js. */
  onAuthStateChange(callback) {
    authListeners.add(callback);
    this.getSession().then(({ data }) => {
      if (authListeners.has(callback)) callback('INITIAL_SESSION', data.session);
    });
    return { data: { subscription: { unsubscribe: () => authListeners.delete(callback) } } };
  },
};

/**
 * Orders API
 */
export const orderApi = {
  /** Save a newly placed order (guests allowed; a signed-in shopper's token links it to them). */
  async create(order) {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...customerAuthHeaders() },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw await readError(response, 'Could not save your order.');
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /** The signed-in shopper's orders. */
  async listMine() {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, { headers: customerAuthHeaders() });
      if (!response.ok) throw await readError(response, 'Could not load your orders.');
      return { data: await response.json(), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /** Every order (admin only). */
  async listAll() {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, { headers: adminAuthHeaders() });
      if (!response.ok) throw await readError(response, 'Could not load orders.');
      return { data: await response.json(), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /** Change an order's status (admin only). */
  async updateStatus(id, status) {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw await readError(response, 'Could not update the order.');
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};

/**
 * Main supabase-like object that matches the Supabase client interface
 * used in the codebase, but calls our Cloudflare Worker API instead.
 */
export const supabase = {
  from: (table) => {
    if (table === 'app_products') return productApi;
    if (table === 'cart_items') return cartQuery();
    throw new Error(`Table ${table} not supported`);
  },
  rpc,
  channel,
  auth: authApi,
};

/** The Worker is always the backend now. */
export const isSupabaseConfigured = true;
