# ChyGodwin Mobile

Separate Expo application for the ChyGodwin storefront.

## Run locally

```sh
npm install
npx expo start
```

Use Expo Go on a phone connected to the same network, or open the web preview from the Expo terminal.

## Install as an iPhone web app

This app is configured as a separate Netlify site so its deployment does not replace the shop website:

1. In Netlify, import `Nwite200/chygodwinfoods` from GitHub and choose `chygodwin-mobile` as the package directory. Leave the base directory at the repository root.
2. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the new Netlify site's environment variables. Use the same Supabase project as the website; never use a Supabase secret key in the app.
3. Deploy the site. Netlify reads the build command and publish directory from [`netlify.toml`](./netlify.toml). The resulting HTTPS site URL is the PWA link; pushes to the production branch will publish updates.
4. On iPhone, open that URL in Safari, tap Share, choose **Add to Home Screen**, and enable **Open as Web App** before adding it.

To build locally, run `npm run build:web`; the generated static site is in `dist`.

The PWA includes a web manifest, app icons, and standalone display metadata. It requires an internet connection; offline caching is not configured.

## Supabase setup

1. Set `EXPO_PUBLIC_SUPABASE_URL` in `.env` to the project's HTTPS URL.
2. Set `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project's publishable key. Never put a Supabase secret key in the mobile app.
3. Run [`supabase/cart_schema.sql`](supabase/cart_schema.sql) in the Supabase SQL editor. It creates the user-scoped `cart_items` table, row-level security policies, atomic add-item function, and Realtime publication membership.
4. Enable email/password sign-in in Supabase Auth.

The mobile app and website use the same `public.cart_items` rows for signed-in users. Sign in to both with the same Supabase account to see cart changes sync across devices. The website also supports creating and signing in to an email/password account from its Account page.

The app sends checkout to the existing website, where the shared cart is loaded before delivery details are entered. The website's current checkout is a demonstration flow: it does not charge cards or persist orders to a production order-management system.

## Build an Android APK

1. Sign in to Expo and link this app to an EAS project:

```sh
npx eas-cli login
npx eas-cli init
```

2. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as EAS environment variables for the `preview` build environment.
3. Build the APK:

```sh
npx eas-cli build --platform android --profile preview
```

When EAS finishes, download the APK from the build page and upload it to a file-sharing service that allows reviewers to download it.

## Record the submission demo

Record one continuous take using a test account and avoid showing passwords or private account information:

1. Sign in to the website and add a product to the cart.
2. Open the installed Android app, sign in to the same account, and show the shared item.
3. Change the quantity in the app and show the updated cart on the website.
4. Open checkout from the app and continue to the website to show the shared cart and existing checkout/confirmation flow.

The website's checkout and order history are demonstrations only; do not present them as real payment processing or persistent order tracking.

## Install on iPhone

For a standalone install (not Expo Go), an Apple Developer account is required. The iPhone must be registered for an internal preview build.

```sh
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform ios --profile preview
```

Follow EAS prompts to connect the Apple Developer account and register the iPhone. When the build finishes, open its install link on that iPhone. The bundle identifier is `com.chygodwinfoods.mobile`; change it in `app.json` if it is already registered by another developer.
