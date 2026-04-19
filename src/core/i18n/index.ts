/**
 * i18n initialisation and public API for the template application.
 *
 * Layer: core/i18n — configures i18next with react-i18next and exposes the
 * locale registry (message objects, locale list, display labels).
 *
 * Key design decisions:
 * - i18next is only initialised on the client (`typeof window !== "undefined"`
 *   guard) so this module is safe to import during SSR without side-effects.
 * - The static `messages` map provides direct, type-safe access to
 *   translations without the i18next hook overhead; use it in non-component
 *   code or when the component already knows the active locale.
 * - Helper exports from `../lib/locale` are re-exported here so callers can
 *   import locale utilities from a single `core/i18n` entry point.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { enUS } from "./en-us";
import { zhHans } from "./zh-hans";
import { FALLBACK_LOCALE } from "../lib/locale";
import { LOCALE_REGISTRY, LOCALE_LIST } from "../lib/locale-registry";
import type { Locale, MessageSchema } from "./types";

// Re-export from locale.ts so consumers can import from either place
export { COOKIE_LOCALE_KEY, FALLBACK_LOCALE, toSupportedLocale } from "../lib/locale";

/** Ordered list of all supported locale identifiers — derived from LOCALE_REGISTRY. */
export const localeList: Locale[] = LOCALE_LIST;

/**
 * Static map of locale → full translation object.
 * Prefer this over `i18n.t()` in non-hook contexts (e.g. SSR, utility
 * functions) where the i18next instance may not yet be initialised.
 *
 * When adding a new locale: add an entry here AND in the `resources` block
 * of the i18next init call below. Both must be updated — they cannot be
 * derived from LOCALE_REGISTRY because each value is a statically-imported
 * ES module, not a runtime path.
 */
export const messages: Record<Locale, MessageSchema> = {
  "zh-Hans": zhHans,
  "en-US": enUS
};

/** Human-readable display names for the locale switcher — derived from LOCALE_REGISTRY. */
export const localeLabels: Record<Locale, string> = Object.fromEntries(
  LOCALE_LIST.map((k) => [k, LOCALE_REGISTRY[k].label])
) as Record<Locale, string>;

// SSR guard: i18next relies on browser globals and must only be initialised
// in a browser environment. During SSR the static `messages` map is used
// directly without going through i18next.
if (typeof window !== "undefined") {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        "zh-Hans": { translation: zhHans },
        "en-US": { translation: enUS }
      },
      fallbackLng: FALLBACK_LOCALE,
      supportedLngs: localeList,
      // Only load the exact locale key — no region fallback chain needed
      load: "currentOnly",
      // Values are already safe strings; HTML escaping would double-encode them
      interpolation: { escapeValue: false }
    });
}

export default i18n;
export type { Locale };
