/**
 * Dark-mode preference hook with localStorage persistence.
 * Layer: core/hooks — no feature or page imports.
 *
 * The lazy initializer in useState reads localStorage synchronously on first
 * render, so the initial state matches the stored preference without a
 * useEffect round-trip. index.html's inline script applies the same key before
 * React mounts, preventing a theme flash.
 */
import { useState, useEffect } from "react";

const THEME_STORAGE_KEY = "app-theme-mode";

function readStoredTheme(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark";
}

export function useTheme(): { isDarkMode: boolean; setIsDarkMode: (v: boolean) => void } {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(readStoredTheme);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("theme-dark");
      localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } else {
      document.documentElement.classList.remove("theme-dark");
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    }
  }, [isDarkMode]);

  return { isDarkMode, setIsDarkMode };
}
