/**
 * Page component for unmatched routes (404 Not Found).
 *
 * Role: Rendered in two distinct contexts by the router:
 *   1. Inside /:locale — the locale is available via useParams and the page
 *      is wrapped in RootLayout (nav, footer, theme).
 *   2. Outside any locale prefix (the top-level catch-all) — RootLayout is
 *      NOT available, so the router passes FALLBACK_LOCALE as a prop instead
 *      to ensure the page still renders in a known language.
 *
 * Locale resolution priority: the explicit prop (from the router's top-level
 * catch-all) takes precedence over the URL param so that cases where the URL
 * has no locale segment are handled correctly.
 *
 * The "go home" button navigates to the canonical locale prefix (/en or /zh),
 * giving the user a recoverable path back to valid content.
 */
import { useParams, useNavigate } from "react-router-dom";
import { messages } from "../core/i18n";
import { FALLBACK_LOCALE, toSupportedLocale, getLocaleHref } from "../core/lib/locale";
import type { Locale } from "../core/types/locale";

interface NotFoundPageProps { locale?: Locale; }

/**
 * 404 page. Accepts an optional locale prop for use outside the locale route
 * shell; falls back to the URL param when the prop is absent.
 */
export function NotFoundPage({ locale: propLocale }: NotFoundPageProps = {}) {
  const params = useParams<{ locale: string }>();

  // propLocale (supplied by the top-level catch-all) wins over the URL param
  // so we always have a valid locale even when there is no :locale segment.
  const resolvedLocale = toSupportedLocale(propLocale || params.locale);

  // Look up the localised string bundle; fall back to FALLBACK_LOCALE strings
  // if the resolved locale is somehow missing from the messages map.
  const t = messages[resolvedLocale] || messages[FALLBACK_LOCALE];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center pt-8 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-serif text-jade mb-4">{t.notFound.title}</h1>
        <p className="text-ink/70 mb-8">{t.notFound.message}</p>
        {/* Navigate to the locale-prefixed home rather than "/" so that
            LocaleRoute does not need to re-detect the locale on arrival. */}
        <button
          onClick={() => navigate(getLocaleHref(resolvedLocale))}
          className="rounded-lg border border-jade bg-jade text-white px-6 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          {t.notFound.goHome}
        </button>
      </div>
    </div>
  );
}
