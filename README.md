# Chygodwin Foodstuffs

React + Vite storefront, served by a single Cloudflare Worker (`worker.js`) that
also provides the API (products, shopper accounts, carts, orders, admin login)
on Cloudflare D1 and KV. The site used to run on Supabase; the website no longer
uses it.

See [`DEPLOY_STEPS.md`](./DEPLOY_STEPS.md) for local development and deployment.

## What lives where

| Thing | Where |
|---|---|
| Products, carts, orders, shopper accounts | Cloudflare D1 (`migrations/`) |
| Admin login lockout counters | Cloudflare KV (`ADMIN_LIMITS_KV`) |
| Admin password hash, token signing key | Cloudflare secrets (`wrangler secret put`) |
| Product images uploaded in the admin console | D1 `images` table, served at `/api/images/:id` |

Shoppers sign in with email and password. Google sign-in was removed with Supabase.

## Mobile app (`chygodwin-mobile/`)

The Expo app was **not** migrated. It still signs in and keeps its shared cart in
Supabase, so accounts and carts are no longer shared with the website. Shoppers
who register on the website have a separate account from the mobile app. Moving
the app to the Worker API needs its own change.

## Moving existing products from Supabase

1. In the Supabase SQL editor run `select json_agg(app_products) from app_products;`
   and save the result as `products-export.json`.
2. `node scripts/import-products.mjs products-export.json > import.sql`
3. `npx wrangler d1 execute chygodwinfoods --remote --file=import.sql`
   (use `--local` to try it on your local database first).

Checkout saves orders to D1, but it is still a demonstration flow: it does not
take card payments, and order totals are calculated in the browser, so check them
before fulfilling an order.
