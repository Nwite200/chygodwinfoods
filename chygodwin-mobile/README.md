# ChyGodwin Mobile

Separate Expo application for the ChyGodwin storefront.

## Run locally

```sh
npm install
npx expo start
```

Use Expo Go on a phone connected to the same network, or open the web preview from the Expo terminal.

## Install as an iPhone web app

Build the static PWA with `npm run build:web`. Deploy the generated `dist` directory to a hosting service with HTTPS; the PWA cannot be installed from a `file://` path. On iPhone, open the deployed URL in Safari, tap Share, choose **Add to Home Screen**, and enable **Open as Web App** before adding it.

The PWA includes a web manifest, app icons, and standalone display metadata. It requires an internet connection; offline caching is not configured.

## Supabase setup

1. Set `EXPO_PUBLIC_SUPABASE_URL` in `.env` to the project's HTTPS URL.
2. Set `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project's publishable key. Never put a Supabase secret key in the mobile app.
3. Run [`supabase/cart_schema.sql`](supabase/cart_schema.sql) in the Supabase SQL editor. It creates the user-scoped `cart_items` table, row-level security policies, atomic add-item function, and Realtime publication membership.
4. Enable the needed sign-in providers in Supabase Auth.

The mobile cart syncs through `public.cart_items` for the signed-in user. The existing web cart currently uses local React state, so web/mobile cart sharing requires a separate web integration; this project intentionally does not modify the web app.

## Install on iPhone

For a standalone install (not Expo Go), an Apple Developer account is required. The iPhone must be registered for an internal preview build.

```sh
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform ios --profile preview
```

Follow EAS prompts to connect the Apple Developer account and register the iPhone. When the build finishes, open its install link on that iPhone. The bundle identifier is `com.chygodwinfoods.mobile`; change it in `app.json` if it is already registered by another developer.
