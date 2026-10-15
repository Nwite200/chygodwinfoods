# React + Vite

## Google sign-in setup

The account page uses Supabase Auth with Google OAuth. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase project API settings. Only the publishable key belongs in client-side environment variables; never use the Supabase secret key in a `VITE_` variable.

In Supabase, enable Google under **Authentication → Sign In / Providers**, then set the **Site URL** to `https://chygodwinfoods.netlify.app` and allow these redirect URLs:

- `https://chygodwinfoods.netlify.app/`
- `http://localhost:5173/`

Add the Supabase callback URL (`https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`) to the authorized redirect URIs in the Google OAuth client. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the Netlify project's environment variables, then trigger a new deploy.

## Mobile app cart sharing

The Expo application lives in [`chygodwin-mobile/`](./chygodwin-mobile/). To enable its shared cart on the website and in the app:

1. Run [`chygodwin-mobile/supabase/cart_schema.sql`](./chygodwin-mobile/supabase/cart_schema.sql) in the Supabase SQL editor.
2. Configure the mobile app's `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the same Supabase project used by the website.
3. Sign in to both clients with the same Supabase account. The website supports Google OAuth and email/password; the mobile app supports email/password.
4. Deploy the updated website and set the same two `EXPO_PUBLIC_...` values in EAS for Android preview builds. See [`chygodwin-mobile/README.md`](./chygodwin-mobile/README.md) for APK build instructions.

Checkout currently continues from the mobile app to the website. The website's existing checkout is a demonstration flow and does not process real card payments or persist production orders.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
