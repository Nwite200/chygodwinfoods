# Cloudflare deployment (Worker + static site)

The site and the API are one Cloudflare Worker (`worker.js`). `npm run build`
creates `dist/`, which the Worker serves; `/api/*` is handled by the Worker.

## Local development

1. `npm install`
2. Create your local secrets (once, or whenever you change the password):
   `node scripts/setup-dev-vars.mjs 'a long new password'`
   This writes `.dev.vars` (git-ignored) with a password hash and a random token secret.
3. `npm run db:local`  (creates the local D1 tables from `migrations/`)
4. Terminal A: `npm run api`   (Worker on http://localhost:8787)
   Terminal B: `npm run dev`   (Vite; proxies `/api` to the Worker)
5. Check config problems: `node scripts/check-login.mjs "chygodwinfoods@gmail.com" 'your password'`

Leave `VITE_API_BASE_URL` empty in `.env` so every call is same-origin.
Never put passwords or hashes in any `VITE_*` variable or in `wrangler.toml`:
they are either shipped to every visitor or committed to git.

## First deploy

1. `npx wrangler login`
2. `npx wrangler d1 create chygodwinfoods`, then paste the printed `database_id`
   into `wrangler.toml`.
3. `npx wrangler d1 migrations apply chygodwinfoods --remote`
4. Set production secrets (use the same password hash as above, and a *different*
   random token secret from `openssl rand -hex 32`):
   - `npx wrangler secret put ADMIN_PASSWORD_HASH`
   - `npx wrangler secret put TOKEN_SECRET`
5. `npm run build && npx wrangler deploy`
   (or push to GitHub and let the Cloudflare build run these).

`ADMIN_EMAIL` is a plain variable in `wrangler.toml`. The `ADMIN_LIMITS_KV`
binding is also declared there; it is not an environment variable.

## After deploying

Log in at the admin console, then confirm an admin write with a valid token
succeeds and the same call with a missing or altered token returns 401.
