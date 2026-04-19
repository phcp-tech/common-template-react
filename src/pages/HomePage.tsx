/**
 * Page component for the /:locale (home) route.
 * Role: Thin route wrapper. Replace this with your own feature component.
 * Constraint: core/ must not import from pages/ (this file may freely import from core/).
 */
import { useParams } from "react-router-dom";
import { toSupportedLocale } from "../core/lib/locale";
import { messages, FALLBACK_LOCALE } from "../core/i18n";
import { PageBackground } from "../core/components/ui/PageBackground";

export function HomePage() {
  const { locale } = useParams<{ locale: string }>();
  const resolvedLocale = toSupportedLocale(locale);
  const t = messages[resolvedLocale] || messages[FALLBACK_LOCALE];

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      <PageBackground show={true} />
      <div className="relative z-10 flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <div className="text-center max-w-2xl animate-rise-in">
          <h1 className="font-serif text-4xl text-jade mb-4 sm:text-5xl">
            {t.home.heading}
          </h1>
          <p className="text-ink/70 text-lg leading-relaxed">
            {t.home.description}
          </p>
        </div>
      </div>
    </main>
  );
}
