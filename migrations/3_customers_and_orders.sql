-- Shopper accounts (email + password, scrypt hashed in the Worker)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- The app's cart rows carry display fields as well as quantity
ALTER TABLE cart_items ADD COLUMN product_name TEXT;
ALTER TABLE cart_items ADD COLUMN product_image TEXT;
ALTER TABLE cart_items ADD COLUMN price REAL;
ALTER TABLE cart_items ADD COLUMN updated_at TEXT;

-- Orders placed at checkout (full order object kept as JSON in `data`)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    email TEXT,
    status TEXT NOT NULL DEFAULT 'Processing',
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (email);
