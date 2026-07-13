# React Template Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a business-ready React SPA template with a generated offline PWA, reliable locale state, accessible controls, resilient theming, and automated quality checks.

**Architecture:** Vite owns deployment metadata and generates the PWA service worker through `vite-plugin-pwa`. React Router owns the route locale and synchronises i18next plus the locale cookie. Tailwind semantic colours resolve from CSS variables, so a single theme class changes the whole palette safely.

**Tech Stack:** React 19, TypeScript, Vite 7, Vite PWA/Workbox, Tailwind CSS 3, React Router 7, Vitest, Testing Library, ESLint flat config, GitHub Actions.

---

### Task 1: Add regression tests for locale and theme behaviour

**Files:**
- Modify: `src/core/lib/__tests__/locale.test.ts`
- Modify: `src/core/hooks/__tests__/useTheme.test.ts`
- Create: `src/router.test.tsx`

- [ ] **Step 1: Write failing tests**

Add a locale test asserting that `/enquiry` falls back rather than matching the `en` route segment. Add a theme test that makes `Storage.prototype.getItem` and `setItem` throw and asserts the hook still updates the document class. Render `/zh/` through `MainApp` and assert `i18n.language` is `zh-Hans`.

- [ ] **Step 2: Run the focused tests and observe red**

Run: `npm test -- src/core/lib/__tests__/locale.test.ts src/core/hooks/__tests__/useTheme.test.ts src/router.test.tsx`

Expected: the segment, storage, and route synchronisation expectations fail before implementation.

- [ ] **Step 3: Implement only the behaviour required by the tests**

Make `getLocaleFromPath` inspect the first whole segment. Wrap browser storage access in safe helpers. In `LocaleRoute`, synchronise i18next and the cookie in an effect after the route has passed validation.

- [ ] **Step 4: Re-run focused tests**

Run: `npm test -- src/core/lib/__tests__/locale.test.ts src/core/hooks/__tests__/useTheme.test.ts src/router.test.tsx`

Expected: all focused tests pass.

### Task 2: Make navigation and Markdown interactions accessible

**Files:**
- Create: `src/core/components/layout/__tests__/Header.test.tsx`
- Create: `src/core/components/ui/__tests__/Markdown.test.tsx`
- Modify: `src/core/components/layout/Header.tsx`
- Modify: `src/core/components/ui/Markdown.tsx`

- [ ] **Step 1: Write failing tests**

Assert the theme control has an accessible name and pressed state. Assert the locale control is a labelled native select and changing it navigates to the corresponding locale route. Assert an image can be opened with Enter, the preview exposes dialog semantics, Escape closes it, and focus returns to the image.

- [ ] **Step 2: Run focused tests and observe red**

Run: `npm test -- src/core/components/layout/__tests__/Header.test.tsx src/core/components/ui/__tests__/Markdown.test.tsx`

Expected: the tests fail because the controls currently use an unlabeled custom menu and non-dialog lightbox.

- [ ] **Step 3: Implement minimal accessible controls**

Replace the locale popup with `<select aria-label={...}>`, retain SPA navigation through `useNavigate`, add `aria-label` and `aria-pressed` to the theme button, and add keyboard/focus lifecycle handling to the Markdown image dialog.

- [ ] **Step 4: Re-run focused tests**

Run: `npm test -- src/core/components/layout/__tests__/Header.test.tsx src/core/components/ui/__tests__/Markdown.test.tsx`

Expected: all focused tests pass.

### Task 3: Replace the handwritten PWA and hard-coded public metadata

**Files:**
- Modify: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `README.md`
- Delete: `public/sw.js`, `public/manifest.json`, `public/sitemap.xml`
- Modify: `public/robots.txt`

- [ ] **Step 1: Add PWA and quality dependencies**

Run: `npm install --save-dev vite-plugin-pwa eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals @vitest/coverage-v8`

- [ ] **Step 2: Configure Vite PWA**

Use `VitePWA({ registerType: 'autoUpdate', manifest: { ... } })` with the existing icons, generated manifest, and Workbox precaching. Set `BrowserRouter` to Vite's `BASE_URL` and use the plugin's `registerSW` virtual module from `main.tsx` so updates activate correctly.

- [ ] **Step 3: Remove stale deployment identity**

Delete the handwritten service worker, manifest, and fixed-domain sitemap. Keep `robots.txt` generic and update the README with per-product SEO and PWA customisation instructions.

- [ ] **Step 4: Verify generated PWA artifacts**

Run: `npm run build:prod`

Expected: `dist/manifest.webmanifest` and the generated service worker exist; neither source nor output contains `hkc.wiki` or `hkc-static-shell`.

### Task 4: Simplify the theme system and defer Markdown code

**Files:**
- Modify: `tailwind.config.ts`, `src/index.css`, layout and page components, `src/router.tsx`

- [ ] **Step 1: Write a failing route-render test**

Extend `src/router.test.tsx` so direct navigation to `/en/terms` renders the legal-page route without eagerly mounting Markdown on the home route.

- [ ] **Step 2: Run the test and observe red**

Run: `npm test -- src/router.test.tsx`

Expected: the test reflects the current eager import graph.

- [ ] **Step 3: Implement semantic variables and lazy legal route**

Map Tailwind's ink, paper, cloud, jade, and bronze values to RGB CSS variables. Replace global class-substring overrides with `.theme-dark` variable values. Lazily import the legal-page wrapper and wrap it in a small loading fallback.

- [ ] **Step 4: Re-run the route test and build**

Run: `npm test -- src/router.test.tsx && npm run build:prod`

Expected: the route passes and the initial entry no longer imports the legal-page Markdown renderer.

### Task 5: Establish quality gates and document the template

**Files:**
- Create: `eslint.config.js`, `.github/workflows/ci.yml`
- Modify: `package.json`, `vitest.config.ts`, `README.md`, `.gitignore`

- [ ] **Step 1: Add lint, coverage, and CI commands**

Add `lint`, `test:coverage`, and `check` package scripts. Configure ESLint's flat config for TypeScript/React and configure Vitest V8 coverage reports. Make CI run `npm ci`, `npm run lint`, `npm run test:coverage`, and `npm run build:prod`.

- [ ] **Step 2: Run each quality command**

Run: `npm run lint`, `npm run test:coverage`, `npm run build:prod`.

Expected: all commands pass; coverage and build artifacts are ignored by Git.

- [ ] **Step 3: Update the README**

Document PWA behaviour, configurable app metadata, locale-routing contract, lint/coverage commands, and deployment prerequisites.
