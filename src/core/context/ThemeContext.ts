/**
 * React context for the application-wide dark-mode theme state.
 *
 * Layer: core/context — thin context + accessor hook; the actual state lives
 * in `core/hooks/useTheme` and is owned by `RootLayout`.
 *
 * Usage pattern:
 *   1. `RootLayout` calls `useTheme()` and passes the result to
 *      `<ThemeContext.Provider value={...}>`.
 *   2. Any descendant calls `useThemeContext()` to read or update the theme.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import React from "react";

/** Shape of the value exposed through `ThemeContext`. */
export type ThemeContextType = {
  /** Whether dark mode is currently active. */
  isDarkMode: boolean;
  /** Callback to update the theme; triggers DOM class and localStorage sync. */
  setIsDarkMode: (mode: boolean) => void;
};

/**
 * Context object. Initialised as `undefined` so that `useThemeContext` can
 * detect components that are rendered outside a provider and throw a helpful
 * error instead of silently operating on a stale/default value.
 */
export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

/**
 * Convenience hook that retrieves the theme context and throws a descriptive
 * error if called outside a `ThemeContext.Provider` subtree.
 *
 * @returns The current `ThemeContextType` value.
 * @throws {Error} When called outside a provider.
 */
export function useThemeContext(): ThemeContextType {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeContext.Provider");
  return ctx;
}
