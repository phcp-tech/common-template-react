/**
 * Header — site-wide navigation header.
 * Layer: core/components/layout — no feature-layer imports.
 *
 * Responsibilities:
 * - Logo + site title (links to locale root).
 * - Primary nav link (Home) with active-page highlighting.
 * - Dark-mode toggle button (Sun/Moon via CSS class swap).
 * - Locale switcher dropdown (persists cookie, calls i18n.changeLanguage,
 *   SPA-navigates to equivalent path in new locale).
 *
 * Locale dropdown closes on outside-click (document listener + ref) and Escape.
 * Constraint: must NOT import from features/ or pages/.
 */
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { messages } from "../../i18n";
import { getLocaleHref } from "../../lib/locale";
import { LOCALE_REGISTRY } from "../../lib/locale-registry";
import type { Locale } from "../../types/locale";
import { LocaleMenu } from "../ui/LocaleMenu";

export type HeaderProps = {
  activeLocale: Locale;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  currentPage?: "home" | "other";
};

export function Header({ activeLocale, isDarkMode, setIsDarkMode, currentPage }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const t = messages[activeLocale];

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === activeLocale) return;

    const oldPrefix = `/${LOCALE_REGISTRY[activeLocale].urlPrefix}`;
    const newPrefix = `/${LOCALE_REGISTRY[nextLocale].urlPrefix}`;
    const suffix = location.pathname.startsWith(oldPrefix) ? location.pathname.slice(oldPrefix.length) : "/";
    navigate(`${newPrefix}${suffix}${location.search}${location.hash}`);
  };

  const themeTip = isDarkMode ? t.header.themeMode.light : t.header.themeMode.dark;

  return (
    <header className="relative z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to={getLocaleHref(activeLocale)}
            aria-label={t.header.title}
            className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-jade/40 bg-jade/10 transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-jade active:scale-95 sm:h-11 sm:w-11"
          >
            <img src={`${import.meta.env.BASE_URL}logo192.png`} alt="" className="h-full w-full object-cover" />
          </Link>
          <div className="min-w-0">
            <p className="font-serif text-lg tracking-wide sm:text-xl">{t.header.title}</p>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-normal md:gap-4">
          <nav className="flex items-center gap-6 text-sm">
            <Link
              to={getLocaleHref(activeLocale)}
              className={`menu-link ${currentPage === "home" ? "text-jade font-medium" : ""}`}
            >
              {t.header.nav.home}
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={themeTip}
            aria-label={themeTip}
            aria-pressed={isDarkMode}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-surface/80 text-ink/80 hover:text-jade"
          >
            <span className="theme-toggle-icon-day"><Sun className="h-5 w-5" /></span>
            <span className="theme-toggle-icon-night"><Moon className="h-6 w-6 fill-current" /></span>
          </button>

          <LocaleMenu
            activeLocale={activeLocale}
            label={t.header.localeLabel}
            onChange={handleLocaleChange}
          />
        </div>
      </div>
    </header>
  );
}
