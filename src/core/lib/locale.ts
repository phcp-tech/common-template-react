/**
 * Locale detection, cookie persistence, and URL-path helpers.
 *
 * Layer: core/lib — browser-aware utilities safe to call on the client and
 * conditionally safe on the server (all document/navigator accesses are
 * guarded by SSR guards).
 *
 * All locale↔URL mappings are derived from LOCALE_REGISTRY so that adding a
 * new language only requires an entry there.
 *
 * Constraint: must NOT import from features/ or pages/.
 */

import { LOCALE_REGISTRY, LOCALE_LIST, FALLBACK_LOCALE as _FALLBACK } from "./locale-registry";
import type { Locale } from "./locale-registry";

/** Cookie name used to persist the user's locale preference across sessions. */
export const COOKIE_LOCALE_KEY = "app_locale";

/** Re-export so consumers that import FALLBACK_LOCALE from here keep working. */
export { FALLBACK_LOCALE } from "./locale-registry";

/**
 * Normalises an arbitrary locale string (BCP-47 tag, URL segment, browser
 * language code, etc.) to one of the supported `Locale` values.
 *
 * Strategy: find the first registry entry whose `bcpPrefix` is a prefix of the
 * lowercased input. Falls back to FALLBACK_LOCALE when no prefix matches.
 *
 * @param value - Raw locale string, or `null`/`undefined` if absent.
 * @returns A supported `Locale` value.
 */
export function toSupportedLocale(value?: string | null): Locale {
  if (!value) return _FALLBACK;
  const lower = value.toLowerCase();
  const found = LOCALE_LIST.find((k) => lower.startsWith(LOCALE_REGISTRY[k].bcpPrefix));
  return found ?? _FALLBACK;
}

/**
 * Reads the locale preference from `document.cookie`.
 *
 * SSR guard: returns `null` when `document` is not available.
 *
 * @returns The stored `Locale`, or `null` if the cookie is absent or the
 *   environment is non-browser.
 */
export function getLocaleCookie(): Locale | null {
  // SSR guard — document is not available during server-side rendering
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    // Find the cookie entry that starts with the expected key prefix
    .find((c) => c.startsWith(`${COOKIE_LOCALE_KEY}=`));
  if (!match) return null;
  // Slice past "app_locale=" and decode any percent-encoded characters
  const value = decodeURIComponent(match.slice(COOKIE_LOCALE_KEY.length + 1));
  return toSupportedLocale(value);
}

/**
 * Persists the locale preference in `document.cookie` for one year.
 *
 * Cookie attributes:
 * - `max-age=31536000` — 365 days, survives browser restarts.
 * - `path=/`          — visible to every page on the origin.
 * - `SameSite=Lax`    — sent on top-level navigations; not sent on
 *   cross-site sub-resource requests.
 *
 * SSR guard: no-ops silently when `document` is not available.
 *
 * @param locale - The `Locale` value to persist.
 */
export function setLocaleCookie(locale: Locale): void {
  // SSR guard — document is not available during server-side rendering
  if (typeof document === "undefined") return;
  // 60s × 60min × 24h × 365d = one year in seconds
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_LOCALE_KEY}=${encodeURIComponent(locale)};max-age=${maxAge};path=/;SameSite=Lax`;
}

/**
 * Determines the best initial locale by checking, in priority order:
 * 1. Persisted cookie preference.
 * 2. Browser language (`navigator.languages[0]` or `navigator.language`).
 * 3. `FALLBACK_LOCALE`.
 *
 * SSR guard: `navigator` access is wrapped so this is safe in server environments.
 *
 * @returns The resolved `Locale` value.
 */
export function getInitialLocale(): Locale {
  const fromCookie = getLocaleCookie();
  if (fromCookie) return fromCookie;
  // SSR guard — navigator is not available during server-side rendering
  if (typeof navigator !== "undefined") {
    const primaryLang = (navigator.languages && navigator.languages[0]) || navigator.language;
    if (primaryLang) {
      const lower = primaryLang.toLowerCase();
      const found = LOCALE_LIST.find((k) => lower.startsWith(LOCALE_REGISTRY[k].bcpPrefix));
      if (found) return found;
    }
  }
  return _FALLBACK;
}

/**
 * Infers the active locale from a URL pathname.
 *
 * Checks each registry entry's `urlPrefix`; returns FALLBACK_LOCALE when no
 * prefix matches (e.g. for "/" or unknown paths).
 *
 * @param pathname - The `location.pathname` value (e.g. `"/en/articles"`).
 * @returns The inferred `Locale`.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const found = LOCALE_LIST.find((k) => pathname.startsWith(`/${LOCALE_REGISTRY[k].urlPrefix}`));
  return found ?? _FALLBACK;
}

/**
 * Returns the root href for a given locale (used for logo/home links).
 *
 * @param locale - The target locale.
 * @returns e.g. `"/en/"` for English, `"/zh/"` for Simplified Chinese.
 */
export function getLocaleHref(locale: Locale): string {
  return `/${LOCALE_REGISTRY[locale].urlPrefix}/`;
}
