# common-template-react

A production-ready React frontend template with multi-locale support (zh-Hans / en-US), dark mode, PWA, locale-prefixed routing, and legal pages.

Extracted from [knowledge-hkc-web](../knowledge-hkc-web). The `core/` layer is fully portable — zero business-domain coupling, copy it to any new project.

## Stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS 3 (custom `ink/paper/jade` palette) |
| i18n | i18next + react-i18next + static `messages` map |
| Routing | react-router-dom 7 (locale-prefixed URLs `/en/...`, `/zh/...`) |
| Testing | Vitest + @testing-library/react + happy-dom |
| PWA | Service worker + Web App Manifest |

## Project Structure

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
- `public/manifest.json` — `name` and `short_name`
- `public/logo192.png`, `public/logo512.png` — app icons
- `src/core/i18n/en-us.ts` and `zh-hans.ts` — `header.title`

### Update legal pages

Edit the four markdown files in `src/core/components/legal/`. They are imported at build time via Vite `?raw`, so no runtime fetch is needed.

### Update footer links

Edit `src/core/components/layout/Footer.tsx`. The Links and Community sections are marked with `TODO` comments for placeholder URLs.

## Architecture Notes

| Decision | Rationale |
|---|---|
| `core → features → pages` one-way dependency | Enforced layering; `core/` can be dropped into any project without modification |
| Feature components use props for `isDarkMode`/`locale` | Portability across micro-frontend shells without host context |
| Static `messages` map alongside i18next | `messages[locale]` is zero-overhead and SSR-safe; i18next enables runtime `useTranslation` hooks |
| Cookie + navigator browser language detection | Cookie persists user preference; navigator provides a sensible first-visit default |
| Inline `<head>` script reads `app-theme-mode` | Runs before first paint — prevents theme flash without server involvement |
| `app_locale` / `app-theme-mode` storage keys | Generic names avoid collisions when projects share a domain |

## Running Tests

```bash
npm test                          # Run all tests once
npm run test:watch                # Watch mode

# Run individual test suites:
npx vitest run src/core/lib/__tests__/
npx vitest run src/core/i18n/__tests__/
npx vitest run src/core/hooks/__tests__/
```

## License

MIT
