/**
 * Locale registry — single source of truth for all locale metadata.
 *
 * Layer: core/lib — no imports from features/ or pages/.
 *
 * Adding a new language requires:
 * 1. Add an entry here (urlPrefix, bcpPrefix, label).
 * 2. Add a translation file in src/core/i18n/ and register it in index.ts.
 */

/**
 * Central registry mapping each locale key to its metadata.
 *
 * - `urlPrefix` — short segment used in URL paths (/zh/..., /en/...).
 * - `bcpPrefix` — BCP-47 prefix for browser-language matching (navigator.language).
 * - `label`     — human-readable display name for the locale switcher UI.
 */
export const LOCALE_REGISTRY = {
  "en-US": {
    urlPrefix: "en",
    bcpPrefix: "en",
    label: "English (US)",
  },
  "zh-Hans": {
    urlPrefix: "zh",
    bcpPrefix: "zh",
    label: "简体中文",
  },
} as const satisfies Record<string, {
  urlPrefix: string;
  bcpPrefix: string;
  label: string;
}>;

/** Canonical locale type — derived from registry keys. */
export type Locale = keyof typeof LOCALE_REGISTRY;

/** Short URL prefix union — derived from registry urlPrefix values. */
export type OutputLocale = (typeof LOCALE_REGISTRY)[Locale]["urlPrefix"];

/**
 * Ordered list of all supported locale keys. Order matches LOCALE_REGISTRY entry
 * insertion order — more-specific prefixes (e.g. "zh-TW") must appear before
 * shorter ones (e.g. "zh-Hans") to prevent false-positive prefix matches in
 * getLocaleFromPath and toSupportedLocale. Cast required: Object.keys returns string[].
 */
export const LOCALE_LIST = Object.keys(LOCALE_REGISTRY) as Locale[];

/** The locale used when no user preference can be detected. Must be a key of LOCALE_REGISTRY. */
export const FALLBACK_LOCALE: Locale = "en-US";
