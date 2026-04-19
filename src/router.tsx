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
import { ErrorBoundary } from "./core/components/layout/ErrorBoundary";
import { RootLayout } from "./core/components/layout/RootLayout";
import {
  getInitialLocale,
  setLocaleCookie,
  getLocaleHref,
  toSupportedLocale,
  FALLBACK_LOCALE,
} from "./core/lib/locale";
import { LOCALE_REGISTRY, LOCALE_LIST } from "./core/lib/locale-registry";
import { HomePage } from "./pages/HomePage";
import { LegalPageWrapper } from "./pages/LegalPageWrapper";
import { NotFoundPage } from "./pages/NotFoundPage";
import type { Locale } from "./core/types/locale";

function RedirectToLocale() {
  const initialLocale = React.useMemo(() => getInitialLocale(), []);
  React.useEffect(() => { setLocaleCookie(initialLocale); }, [initialLocale]);
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

  if (shouldRedirect) {
    const newPath = location.pathname.replace(/^\/[^\/]+/, `/${supportedPrefix}`);
    return <Navigate to={newPath} replace />;
  }

  return (
    <RootLayout resolvedLocale={supportedLocale}>
      <Outlet />
    </RootLayout>
  );
}

export function MainApp() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<RedirectToLocale />} />
          <Route path="/:locale" element={<LocaleRoute />}>
            <Route index element={<HomePage />} />
            <Route path="terms" element={<LegalPageWrapper variant="terms" />} />
            <Route path="privacy" element={<LegalPageWrapper variant="privacy" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage locale={FALLBACK_LOCALE} />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
