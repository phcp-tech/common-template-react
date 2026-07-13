/**
 * Application router and top-level route components.
 *
 * Route hierarchy:
 *   /             → RedirectToLocale (browser locale detection + redirect)
 *   /:locale      → LocaleRoute (validates prefix, provides RootLayout)
 *     index       → HomePage
 *     terms       → LegalPageWrapper (terms of service)
 *     privacy     → LegalPageWrapper (privacy policy)
 *     *           → NotFoundPage (within locale shell)
 *   *             → NotFoundPage (outside locale shell, uses fallback locale)
 *
 * Constraint: no business logic here — pages are thin wrappers.
 */
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import i18n from "./core/i18n";
import { ErrorBoundary } from "./core/components/layout/ErrorBoundary";
import { RootLayout } from "./core/components/layout/RootLayout";
import { LoadingSpinner } from "./core/components/ui/LoadingSpinner";
import {
  getInitialLocale,
  setLocaleCookie,
  getLocaleHref,
  toSupportedLocale,
  FALLBACK_LOCALE,
} from "./core/lib/locale";
import { LOCALE_REGISTRY, LOCALE_LIST } from "./core/lib/locale-registry";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import type { Locale } from "./core/types/locale";

// Legal pages pull in react-markdown/remark-gfm/rehype-sanitize (the
// "vendor-markdown" chunk in vite.config.ts). Lazy-loading keeps that chunk
// out of the initial route graph so the home route doesn't pay for it.
const LegalPageWrapper = React.lazy(() =>
  import("./pages/LegalPageWrapper").then((module) => ({ default: module.LegalPageWrapper }))
);

function RedirectToLocale() {
  const initialLocale = React.useMemo(() => getInitialLocale(), []);
  return <Navigate to={getLocaleHref(initialLocale)} replace />;
}

function localeToPrefix(locale: Locale): string {
  return LOCALE_REGISTRY[locale].urlPrefix;
}

function LocaleRoute() {
  const { locale } = useParams<{ locale: string }>();
  const location = useLocation();

  const actualLocale = locale || "";
  const supportedLocale = toSupportedLocale(actualLocale);
  const supportedPrefix = localeToPrefix(supportedLocale);
  const actualPrefix = actualLocale.toLowerCase();

  const shouldRedirect = !LOCALE_LIST.some(
    (k) => LOCALE_REGISTRY[k].urlPrefix === actualPrefix
  );

  React.useEffect(() => {
    if (shouldRedirect) return;

    setLocaleCookie(supportedLocale);
    void i18n.changeLanguage(supportedLocale);
  }, [shouldRedirect, supportedLocale]);

  if (shouldRedirect) {
    const newPath = location.pathname.replace(/^\/[^/]+/, `/${supportedPrefix}`);
    return <Navigate to={`${newPath}${location.search}${location.hash}`} replace />;
  }

  return (
    <RootLayout resolvedLocale={supportedLocale}>
      <Outlet />
    </RootLayout>
  );
}

export function MainApp() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<RedirectToLocale />} />
          <Route path="/:locale" element={<LocaleRoute />}>
            <Route index element={<HomePage />} />
            <Route
              path="terms"
              element={
                <React.Suspense fallback={<LoadingSpinner />}>
                  <LegalPageWrapper variant="terms" />
                </React.Suspense>
              }
            />
            <Route
              path="privacy"
              element={
                <React.Suspense fallback={<LoadingSpinner />}>
                  <LegalPageWrapper variant="privacy" />
                </React.Suspense>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage locale={FALLBACK_LOCALE} />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
