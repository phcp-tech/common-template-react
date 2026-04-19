/**
 * LegalPage — renders a static legal document (Terms of Service or Privacy Policy).
 *
 * Layer: core/components/legal — reusable page shell for Markdown-based legal
 * content; contains no feature or page imports.
 *
 * The Markdown source files are imported at build time via Vite's `?raw`
 * suffix, which inlines the file content as a plain string — no network
 * request at runtime. The correct file is selected based on `variant` and the
 * URL `locale` param.
 *
 * On mount the component scrolls the window back to the top so navigating
 * from a scrolled page doesn't leave the legal document partway down.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { messages, FALLBACK_LOCALE, toSupportedLocale } from "../../i18n";
import { getLocaleHref } from "../../lib/locale";
import type { Locale } from "../../types/locale";
import { Markdown } from "../ui/Markdown";
import { PageBackground } from "../ui/PageBackground";

// Vite `?raw` imports: the Markdown files are inlined as plain strings at
// build time — no runtime fetch. Four files cover two variants × two locales.
import termsZhHans from "./terms-of-service.zh-hans.md?raw";
import termsEnUs from "./terms-of-service.en-us.md?raw";
import privacyZhHans from "./privacy-policy.zh-hans.md?raw";
import privacyEnUs from "./privacy-policy.en-us.md?raw";

/** Props accepted by the `LegalPage` component. */
export type LegalPageProps = {
  /** Selects which legal document to display. */
  variant: "terms" | "privacy";
  /** Controls the decorative background: hidden in dark mode. */
  isDarkMode: boolean;
};

/**
 * Renders a locale-aware legal document page.
 *
 * @param variant    - `"terms"` for Terms of Service, `"privacy"` for Privacy Policy.
 * @param isDarkMode - Passed to `PageBackground` to suppress it in dark mode.
 */
export function LegalPage({ variant, isDarkMode }: LegalPageProps) {
  // Read the `:locale` URL segment set by the router (e.g. "en" or "zh")
  const { locale } = useParams<{ locale: string }>();
  // Normalise the URL segment to a supported Locale value
  const resolvedLocale = toSupportedLocale(locale) as Locale;
  // Fall back to the default locale messages if the resolved locale is unknown
  const t = messages[resolvedLocale] || messages[FALLBACK_LOCALE];

  // Select the correct Markdown file based on variant and resolved locale
  const markdownContent = variant === "terms"
    ? (resolvedLocale === "zh-Hans" ? termsZhHans : termsEnUs)
    : (resolvedLocale === "zh-Hans" ? privacyZhHans : privacyEnUs);

  // Scroll to top on mount so the user always sees the document heading,
  // regardless of scroll position on the previous page.
  useEffect(() => { window.scrollTo(0, 0); }, []); // Empty deps → run once on mount

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <PageBackground show={!isDarkMode} />
      <main className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-16 pt-2 sm:px-6 sm:pt-3 md:px-10 md:pt-4">
        <p className="mb-4">
          <Link to={getLocaleHref(resolvedLocale)} className="text-sm font-medium text-jade underline-offset-2 hover:underline">
            <span>←</span>
            {t.notFound.goHome}
          </Link>
        </p>
        <article className="animate-rise-in space-y-8 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <div className="wmde-markdown-wrapper">
            <Markdown
              source={markdownContent}
              className="legal-content
                [&>h1]:font-serif [&>h1]:text-2xl [&>h1]:sm:text-3xl [&>h1]:text-ink [&>h1]:mb-2
                [&>p:first-of-type]:text-sm [&>p:first-of-type]:text-ink/60 [&>p:first-of-type]:mb-5 [&>p:first-of-type]:border-b [&>p:first-of-type]:border-ink/10 [&>p:first-of-type]:pb-5
                [&>h2]:font-serif [&>h2]:text-lg [&>h2]:sm:text-xl [&>h2]:text-jade [&>h2]:mt-8 [&>h2]:mb-4
                [&>p]:text-sm [&>p]:leading-7 [&>p]:text-ink/85 [&>p]:mb-4
                [&>ul]:text-sm [&>ul]:leading-7 [&>ul]:text-ink/85 [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:list-inside
                [&>ul>li]:mb-2"
            />
          </div>
        </article>
      </main>
    </div>
  );
}
