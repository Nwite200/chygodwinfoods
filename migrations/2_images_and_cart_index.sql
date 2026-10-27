-- Uploaded product images (stored as base64 text, served at /api/images/:id)
CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- worker.js upserts carts with ON CONFLICT (user_id, product_id), which needs this index
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_user_product
    ON cart_items (user_id, product_id);
