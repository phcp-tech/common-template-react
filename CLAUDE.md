# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Overview

React 19 + TypeScript frontend template (Vite 7): locale-prefixed routing (`/en/...`, `/zh/...` via react-router-dom 7), i18next-backed i18n, Tailwind CSS 3 dark mode driven entirely by CSS variables, and a PWA manifest/service worker via `vite-plugin-pwa`. The `core/` layer (layout, theming, i18n, locale utilities, legal pages) is meant to be business-logic-free and portable to any new project as-is; real product code goes under `features/`, wired up through thin wrappers in `pages/`.

## Commands

```bash
npm install
npm run dev              # dev server at http://localhost:5173
npm run build:dev        # tsc --noEmit && vite build --mode development
npm run build:prod       # tsc --noEmit && vite build --mode production
npm test                 # vitest run
npm run test:watch       # vitest watch mode
npm run lint             # ESLint flat config
npm run test:coverage    # vitest run --coverage (thresholds enforced, see below)
npm run check            # lint + test:coverage + build:prod — same as CI
```

## Non-obvious things

- **Dark mode has no system-preference detection at all.** `useTheme` (`core/hooks/useTheme.ts`) only ever reads/writes `localStorage["app-theme-mode"]`; there's no `matchMedia("(prefers-color-scheme: dark)")` anywhere. A first-time visitor always gets light mode regardless of their OS theme. The inline `<script>` in `index.html` mirrors this — it checks the same localStorage key (not matchMedia) before first paint purely to avoid a flash of the wrong theme, not to honor system preference.
- **Locale resolution priority is cookie → `navigator.languages` → fallback**, evaluated once at `/` (`getInitialLocale` in `core/lib/locale.ts`). The cookie (`app_locale`) is set with `max-age=31536000; path=/; SameSite=Lax`. If the URL's `:locale` segment doesn't match any registered `urlPrefix`, `LocaleRoute` (`router.tsx`) does a one-shot path-rewrite redirect to the resolved locale — but that redirect pass does *not* write the cookie or call `i18n.changeLanguage`; only a *valid* locale segment does.
- **Vitest uses `happy-dom`, not `jsdom`, specifically to dodge a dependency conflict**: jsdom 29 ships `@exodus/bytes` as pure ESM, which breaks `html-encoding-sniffer`'s CJS `require()` and crashes worker startup. `vitest.config.ts` also has to inline `@exodus/bytes` through Vite's ESM pipeline for the same reason should jsdom ever come back transitively.
- **Coverage thresholds in `vitest.config.ts` (78/55/75/80) are set *below* the currently-measured baseline on purpose**, not as an aspirational target — the comment there says so explicitly, and `Header`/`Footer`/`ErrorBoundary` are called out as having real, still-open coverage gaps. Don't read a passing `test:coverage` run as "this app is well-tested everywhere."
- **`VITE_API_BASE_URL` is defined in both `.env.development`/`.env.production` but is not read anywhere under `src/`.** There is deliberately no HTTP client, fetch wrapper, or query library (no axios, no TanStack Query/SWR) — that choice is left to whatever a real project adds under `features/`, since it depends on that product's backend/auth scheme.
- Legal pages (`/terms`, `/privacy`) are the only `React.lazy`-loaded routes, specifically to keep `react-markdown`/`remark-gfm`/`rehype-sanitize` (the `vendor-markdown` Rollup chunk in `vite.config.ts`) out of the initial route graph — the home route shouldn't pay for a markdown renderer it doesn't use. The markdown files themselves are imported via Vite's `?raw` at build time, so there's no runtime fetch for legal content either.
- `vite.config.ts` deliberately omits `build.manifest` — that option only matters for SSR-prerender pipelines that need to look up hashed asset filenames, and this template is a pure client-rendered SPA.
- ESLint's `no-unused-vars` is configured with `argsIgnorePattern`/`varsIgnorePattern: "^_"` — an intentionally-unused parameter or destructured variable should be prefixed with `_` rather than disabled inline.
