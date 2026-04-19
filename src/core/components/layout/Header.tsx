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
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import i18n, { localeLabels, localeList, messages } from "../../i18n";
import { getLocaleHref, setLocaleCookie } from "../../lib/locale";
import { LOCALE_REGISTRY } from "../../lib/locale-registry";
import type { Locale } from "../../types/locale";

export type HeaderProps = {
  activeLocale: Locale;
  isDarkMode: boolean;
  setIsDarkMode: (mode: boolean) => void;
  currentPage?: "home" | "other";
};

export function Header({ activeLocale, isDarkMode, setIsDarkMode, currentPage }: HeaderProps) {
  const navigate = useNavigate();
  const t = messages[activeLocale];
  const [isLocaleOpen, setIsLocaleOpen] = useState(false);
  const localeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (localeMenuRef.current && !localeMenuRef.current.contains(target)) {
        setIsLocaleOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLocaleOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const themeTip = isDarkMode ? t.header.themeMode.light : t.header.themeMode.dark;

  return (
    <header className="relative z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to={getLocaleHref(activeLocale)}
            aria-label={t.header.title}
            className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-jade/40 bg-jade/10 transition-all duration-300 hover:scale-110 hover:shadow-md hover:border-jade active:scale-95 sm:h-11 sm:w-11"
          >
            <img src="/logo192.png" alt="" className="h-full w-full object-cover" />
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
            className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-white/80 text-ink/80 hover:text-jade"
          >
            <span className="theme-toggle-icon-day"><Sun className="h-5 w-5" /></span>
            <span className="theme-toggle-icon-night"><Moon className="h-6 w-6 fill-current" /></span>
          </button>

          <div
            ref={localeMenuRef}
            className="relative flex items-center gap-2 rounded-full border border-ink/15 bg-white/70 px-2.5 py-1.5 backdrop-blur sm:px-3 sm:py-2"
          >
            <label className="sr-only">{t.header.localeLabel}</label>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsLocaleOpen(!isLocaleOpen); }}
              className="flex items-center justify-between gap-2 min-w-[114px] rounded-md bg-white/90 px-2 py-1 text-xs text-ink outline-none hover:text-jade"
            >
              <span>{localeLabels[activeLocale]}</span>
              <svg className="h-3.5 w-3.5 text-ink/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLocaleOpen && (
              <div
                className="absolute right-0 top-[calc(100%+4px)] z-50 mt-1 min-w-[130px] max-w-xs origin-top-right rounded-lg border border-ink/10 bg-white/95 py-1.5 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {localeList.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setIsLocaleOpen(false);
                      if (item !== activeLocale) {
                        setLocaleCookie(item);
                        i18n.changeLanguage(item);
                        const currentPath = window.location.pathname;
                        const oldPrefix = `/${LOCALE_REGISTRY[activeLocale].urlPrefix}`;
                        const newPrefix = `/${LOCALE_REGISTRY[item].urlPrefix}`;
                        navigate(currentPath.replace(new RegExp(`^${oldPrefix}`), newPrefix));
                      }
                    }}
                    className={`flex w-full items-center px-4 py-2 text-left text-xs hover:bg-cloud/55 ${
                      item === activeLocale ? "font-medium text-jade bg-jade/10" : "text-ink/80"
                    }`}
                  >
                    {localeLabels[item]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
