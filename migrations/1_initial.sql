-- Create the app_products table to store product data
CREATE TABLE IF NOT EXISTS app_products (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the cart_items table to store cart items
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial product data (will be populated from Supabase export)
-- This matches the structure from the original Supabase app_products table
INSERT INTO app_products (id, data) VALUES 
  ('dates-powder', '{"name": "Dates Powder (100% Pure Dabino)", "category": "healthy-mixes", "price": 3500, "originalPrice": 4200, "brand": "Chygodwin Select", "image": "/products/dates.svg"}'),
  ('semovita', '{"name": "Semovita (Semolina)", "category": "grains-tubers", "price": 4500, "originalPrice": 5000, "brand": "Golden Terra", "image": "/products/semovita.jpg"}'),
  ('beans', '{"name": "Brown Beans", "category": "beans-seeds", "price": 2800, "originalPrice": 3500, "brand": "Chygodwin Select", "image": "/products/beans.svg"}');