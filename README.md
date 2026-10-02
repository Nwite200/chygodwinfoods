# React + Vite

## Google sign-in setup

The account page uses Supabase Auth with Google OAuth. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the Supabase project API settings. Only the publishable key belongs in client-side environment variables; never use the Supabase secret key in a `VITE_` variable.

In Supabase, enable Google under **Authentication → Sign In / Providers**, then set the **Site URL** to `https://chygodwinfoods.netlify.app` and allow these redirect URLs:

- `https://chygodwinfoods.netlify.app/`
- `http://localhost:5173/`

Add the Supabase callback URL (`https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`) to the authorized redirect URIs in the Google OAuth client. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the Netlify project's environment variables, then trigger a new deploy.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
