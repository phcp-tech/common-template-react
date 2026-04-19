/**
 * Canonical locale type definitions for the HKC web application.
 *
 * Layer: core/types — foundational type primitives shared across every layer.
 * Types are now derived from `locale-registry.ts` — add locales there.
 *
 * Constraint: must NOT import from features/ or pages/.
 */

// Re-export so that all existing consumers (`import type { Locale } from
// "../types/locale"`) continue to compile without any import-path changes.
export type { Locale, OutputLocale } from "../lib/locale-registry";
