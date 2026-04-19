/**
 * RootLayout — client-side application shell.
 * Layer: core/components/layout — owns ThemeContext, Header, and Footer.
 * Constraint: must NOT import from features/ or pages/.
 */
import React from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useTheme } from "../../hooks/useTheme";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { messages, FALLBACK_LOCALE } from "../../i18n";
import type { Locale } from "../../types/locale";

interface RootLayoutProps {
  children: React.ReactNode;
  resolvedLocale: Locale;
}

export function RootLayout({ children, resolvedLocale }: RootLayoutProps) {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const location = useLocation();

  const isLegalPath =
    location.pathname.includes("/terms") || location.pathname.includes("/privacy");
  const currentPage = isLegalPath ? "other" : "home";

  const t = messages[resolvedLocale] || messages[FALLBACK_LOCALE];

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <div className="relative min-h-screen bg-paper text-ink">
        <Header
          activeLocale={resolvedLocale}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          currentPage={currentPage}
        />
        {children}
        <Footer footerText={t.footer} activeLocale={resolvedLocale} />
      </div>
    </ThemeContext.Provider>
  );
}
