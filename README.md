# common-template-react

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh.md">简体中文</a>
</p>

A production-ready React frontend template with multi-locale support (zh-Hans / en-US), dark mode, a Web App Manifest, locale-prefixed routing, and legal pages.

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 3 (custom `ink/paper/surface/jade` palette, CSS-variable-backed for dark mode) |
| i18n | i18next + react-i18next + static `messages` map |
| Routing | react-router-dom 7 (locale-prefixed URLs `/en/...`, `/zh/...`) |
| Testing | Vitest + @testing-library/react + happy-dom |
| Home screen | Web App Manifest (no service worker by default) |

## Project Structure

The `core/` layer is fully portable — zero business-domain coupling, copy it to any new project.

```
src/
├── core/                     # Shared infrastructure — zero business coupling
│   ├── components/
│   │   ├── layout/           # Header, Footer, RootLayout, ErrorBoundary
│   │   ├── ui/               # LoadingSpinner, PageBackground, ContentCard, Markdown
│   │   └── legal/            # LegalPage component + placeholder markdown files
│   ├── context/              # ThemeContext (dark mode)
│   ├── hooks/                # useTheme (localStorage persistence)
│   ├── i18n/                 # MessageSchema, en-US and zh-Hans translations, i18next init
│   ├── lib/                  # locale.ts, locale-registry.ts, date.ts
│   └── types/                # Locale, OutputLocale
├── features/                 # Add your feature components here
├── pages/                    # Thin route wrappers
│   ├── HomePage.tsx          # Replace with your own content
│   ├── LegalPageWrapper.tsx  # Connects ThemeContext to LegalPage
│   └── NotFoundPage.tsx      # 404 fallback
├── router.tsx                # Route definitions
├── main.tsx                  # SPA entry point
└── index.css                 # Global styles + dark-mode CSS variables
```

## Getting Started

```bash
npm install
npm run dev          # Dev server at http://localhost:5173 (VITE_ENV=dev)
npm test             # Run unit tests
npm run build:dev    # Build with development env (VITE_ENV=dev) → dist/
npm run build:prod   # Build with production env (VITE_ENV=prod) → dist/
npm run preview      # Preview production build locally
```

## Customisation Guide

### Add a new locale

1. Add an entry to `src/core/lib/locale-registry.ts`:
   ```typescript
   "ja-JP": { urlPrefix: "ja", bcpPrefix: "ja", label: "日本語" }
   ```
2. Create `src/core/i18n/ja-jp.ts` implementing `MessageSchema`
3. Register in `src/core/i18n/index.ts`: add to `messages`, `resources`, and ensure `LOCALE_LIST` picks it up

### Add a feature

1. Create `src/features/your-feature/` with your components
2. Add a route in `src/router.tsx`
3. Create a thin page wrapper in `src/pages/YourFeaturePage.tsx`
4. Feature components should accept `isDarkMode` and `locale` as **props** (not context) for micro-frontend portability

### Replace branding

- `index.html` — `<title>` and `apple-mobile-web-app-title`
- `public/manifest.webmanifest` — `name`, `short_name`, `theme_color` (same as `<meta name="theme-color">`) and `background_color` (the light-mode page colour, shown on the Android launch screen)
- `public/logo192.png`, `public/logo512.png` — app icons
- `src/core/i18n/en-us.ts` and `zh-hans.ts` — `header.title`
- `public/llms.txt` — the app summary for AI agents (see [llms.txt](#llmstxt))

### Update legal pages

Edit the four markdown files in `src/core/components/legal/`. They are imported at build time via Vite `?raw`, so no runtime fetch is needed.

### Update footer links

Edit `src/core/components/layout/Footer.tsx`. The Links and Community sections are marked with `TODO` comments for placeholder URLs.

### Configure the API base URL

`.env.development` and `.env.production` define `VITE_API_BASE_URL` (defaulting to
`http://localhost:3000` / `https://api.example.com`). It is intentionally not
read anywhere in `src/` yet — the template ships no HTTP client, fetch
wrapper, or data-fetching library (no axios, no React Query/SWR), because that
choice depends on each product's backend and auth scheme.

The variable is reserved for whatever data layer your project adds under
`src/features/`, e.g.:

```typescript
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

Update the two `.env.*` files with your real API URLs (or override per
deployment via your CI/hosting provider's environment variable settings)
before wiring up the first feature that calls a backend.

## Architecture Notes

| Decision | Rationale |
|---|---|
| `core → features → pages` one-way dependency | Enforced layering; `core/` can be dropped into any project without modification |
| Feature components use props for `isDarkMode`/`locale` | Portability across micro-frontend shells without host context |
| Static `messages` map alongside i18next | `messages[locale]` is zero-overhead and SSR-safe; i18next enables runtime `useTranslation` hooks |
| Cookie + navigator browser language detection | Cookie persists user preference; navigator provides a sensible first-visit default |
| Inline `<head>` script reads `app-theme-mode` | Runs before first paint — prevents theme flash without server involvement |
| `app_locale` / `app-theme-mode` storage keys | Generic names avoid collisions when projects share a domain |
| `ink`/`paper`/`surface` colors resolve from CSS variables (`src/index.css`) | A single `.theme-dark` class swaps every consumer's colors at once — no per-component `dark:` classes, `!important`, or `[class*="..."]` overrides |
| Language switcher is a native `<select>`, not a custom popup | Keyboard and screen-reader support come from the browser, with no extra code |
| Legal routes (`/terms`, `/privacy`) are `React.lazy`-loaded | Keeps `react-markdown`/`remark-gfm`/`rehype-sanitize` (the `vendor-markdown` chunk) out of the initial route graph |
| `VITE_API_BASE_URL` is defined but unread by `core`/`pages` | Reserved for your project's own data-fetching layer under `features/`; no HTTP client/query library is opinionated for you (see Customisation Guide) |

## Running Tests

```bash
npm test                          # Run all tests once
npm run test:watch                # Watch mode

# Run individual test suites:
npx vitest run src/core/lib/__tests__/
npx vitest run src/core/i18n/__tests__/
npx vitest run src/core/hooks/__tests__/
```
## llms.txt

The pages render only with JavaScript, so an AI agent that fetches them gets an empty `<div id="root">`. `public/llms.txt` ([llmstxt.org](https://llmstxt.org)) gives agents the key facts instead: what the app is and links to its pages. Edit it for your project. Keep its links relative (no leading `/`), so they work under any base path.

The template has no `llms-full.txt` (the full text of the site in one file). Its content comes from each project's own sources (Markdown docs, JSON data, i18n strings), so a project with real content adds its own generator: one that the dev server serves and the build writes to `dist/`, so it never drifts from the source.

## Manifest, offline support and deployment

`public/manifest.webmanifest` gives the site a home-screen icon and, on Android, a launch screen (`display: standalone`). Its URLs are relative, so it works under any base path.

The template has no service worker. Showcase and content sites do not need one: HTTP caching of the hashed `/assets/*` files is enough, and a deployed service worker is hard to remove (it keeps running in returning visitors' browsers after you delete it). Add one only when users need the app offline, push notifications or background sync:

1. `npm install --save-dev vite-plugin-pwa`
2. In `vite.config.ts`, add `VitePWA({ manifest: false, injectRegister: false, registerType: "autoUpdate", workbox: { cleanupOutdatedCaches: true } })` to `plugins` (`manifest: false` keeps the static manifest).
3. In `src/main.tsx`, call `registerSW({ immediate: true })` from `virtual:pwa-register`, and add `/// <reference types="vite-plugin-pwa/client" />` to `src/vite-env.d.ts`.

Set `VITE_PUBLIC_BASE_PATH` to `/` (default) or a trailing-slash subpath such as `/portal/` before building for a non-root deployment.

The template intentionally does not ship a sitemap for an unrelated domain. Add a product-specific sitemap and canonical/SEO metadata as part of deployment.

## Quality checks

```bash
npm run lint             # ESLint flat-config checks
npm run test:coverage    # Vitest V8 coverage report (enforces thresholds in vitest.config.ts)
npm run check            # lint + coverage + production build
```

`.github/workflows/ci.yml` runs the same `check` steps (`npm ci`, `lint`, `test:coverage`, `build:prod`) on every push and pull request against `main`.
