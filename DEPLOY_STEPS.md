# 📤 Cloudflare Deployment Guide

## Prerequisites
Your project is at `/Users/a/Desktop/untitled folder 3` with all migration changes already in place.

## Step 1: Install Dependencies
```bash
cd /Users/a/Desktop/untitled\ folder\ 3
npm install
```

## Step 2: Login to Cloudflare (first time only)
```bash
npx wrangler login
```
*This opens a browser window for Cloudflare authentication.*

## Step 3: Publish to Cloudflare Pages
```bash
npx wrangler publish
```
*Or deploy dist/ specifically:*
```bash
npx wrangler pages publish dist/
```

## Step 4: Set Environment Variables in Cloudflare Dashboard
After deployment, go to **Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `ADMIN_EMAIL` | `chygodwinfoodstuffs@gmail.com` |
| `ADMIN_PASSWORD_HASH` | `a1cc34df791b1b48371292a73545297db5072e1ad90697f4a2a6d44f6783a5b9:35e2fa8261058af6d201246b009f4b96c768d7fedba4d8bf2942d2f472446ce6` |
| `ADMIN_LIMITS_KV` | *(bind a KV namespace for rate limiting)* |

## Step 5: Update Frontend .env with Deployed URL
Your `.env` already has `VITE_API_BASE_URL=http://localhost:5173`. Update it to your deployed URL:

```env
VITE_API_BASE_URL=https://your-subdomain.pages.dev
# OR
VITE_API_BASE_URL=https://your-worker-name.workers.dev
```

## Step 6: Test the Full Admin Flow
1. Visit your deployed URL
2. Navigate to Admin Console
3. Login with:
   - **Email:** `chygodwinfoodstuffs@gmail.com`
   - **Password:** `ChyAdmin2024!`
4. Test operations:
   - Upload product with image → routes to Worker `/api/upload`
   - Edit product prices → updates catalog
   - Add new products → persists to Cloudflare D1 database

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Admin login is not configured" | Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` are set in Cloudflare dashboard |
| Image upload fails | Verify `ADMIN_LIMITS_KV` KV namespace is bound |
| 404 on API routes | Check `wrangler publish` completed successfully |
| VITE_API_BASE_URL not working | Redeploy after updating .env, or restart dev server |
| Local dev not working | Run `npm run dev` - fallback to `.env` creds if function unreachable |

## ✅ What's Already Complete

| Component | Status |
|-----------|--------|
| `worker.js` | ✅ Routes + product/cart/upload APIs |
| `AdminView.jsx` | ✅ Uses Cloudflare Worker `/api/upload` |
| `.env` | ✅ `VITE_API_BASE_URL`, admin creds configured |
| `functions/api/admin-login.js` | ✅ Cloudflare Pages Function with scrypt + rate limiting |
| `src/supabase.js` | ✅ Configured as Workers API replacement |
| Git remote | ✅ `origin: https://github.com/Nwite200/chygodwinfoods.git` |

## 📋 Quick Commands Summary

```bash
# 1. Install
cd /Users/a/Desktop/untitled\ folder\ 3 && npm install

# 2. Login to Cloudflare
npx wrangler login

# 3. Publish
npx wrangler publish

# 4. Set env vars in Cloudflare dashboard (as shown above)

# 5. Update .env with deployed URL
#    VITE_API_BASE_URL=https://your-url.dev
```

## 🎯 Next Steps

1. Run the commands above in order
2. Set the Cloudflare environment variables in the dashboard
3. Update your frontend `.env` with the deployed URL
4. Test the admin functionality

The migration infrastructure is fully ready - all code changes are in place, you just need to deploy and configure the Cloudflare dashboard variables.