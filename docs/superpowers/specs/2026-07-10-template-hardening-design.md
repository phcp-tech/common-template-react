# React Template Hardening Design

## Goal

Make the template safe to copy into a production React application: retain an installable, offline-capable PWA; align routing and language state; remove project-specific residue; improve accessibility; and add repeatable quality checks.

## Decisions

- Replace the handwritten service worker and static manifest with `vite-plugin-pwa` using Workbox-generated precaching and automatic updates. The plugin will generate the manifest and service worker at build time, including the configured Vite base path.
- Keep the template domain-neutral. Remove the fixed sitemap and do not publish a third-party domain from `robots.txt`; document that each product supplies its own sitemap and site URL.
- Treat the locale in the route as authoritative. `LocaleRoute` synchronises i18next and the preference cookie after validating the locale segment. Locale helpers match a whole path segment, not a prefix.
- Use a native language `<select>` rather than a custom popup. This preserves the visual control while providing keyboard and screen-reader support by default. The theme toggle gets an explicit accessible name and pressed state.
- Switch Tailwind's semantic palette to CSS-variable-backed colours. A single `.theme-dark` variable override handles the custom palette without global substring selectors or `!important`.
- Code-split the legal routes so Markdown rendering is not part of the initial route graph. The Markdown lightbox becomes keyboard-accessible and restores focus on dismissal.
- Add ESLint flat configuration, coverage reporting, a CI workflow, and targeted regression tests. The CI workflow runs lint, tests with coverage, and the production build.

## Boundaries

- This remains a client-rendered React SPA; no SSR, backend, authentication, data-fetching framework, or global state library is added.
- The PWA uses the generated Workbox service worker. It caches the app shell and Vite assets for offline navigation but deliberately does not cache API responses, because API freshness policy is product-specific.
- PWA and SEO metadata remain generic. Products must replace `My App`, icons, API URLs, legal text, and optionally add their own sitemap before launch.

## Verification

- Tests prove exact locale matching, URL-driven i18n synchronisation, storage-failure-safe theme changes, accessible header controls, and Markdown lightbox keyboard behaviour.
- The production build must generate a manifest and service worker, contain no old HKC identifiers, and pass type checking, linting, and Vitest.
