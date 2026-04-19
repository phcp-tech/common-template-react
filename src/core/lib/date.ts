/**
 * Date formatting utilities for the HKC web application.
 *
 * Layer: core/lib — pure, side-effect-free helpers with no DOM or browser
 * dependencies. Safe to call in SSR and Node environments.
 *
 * Constraint: must NOT import from features/ or pages/.
 */

/**
 * Formats an ISO-8601 (or any `Date`-parseable) date string into a
 * localisation-neutral `YYYY/M/D` display string.
 *
 * Edge-case handling:
 * - Empty / falsy input → returns `""` immediately.
 * - Unparseable strings → `new Date(raw)` yields `Invalid Date`; the
 *   `isNaN` guard detects this and returns the original `raw` value so the
 *   caller still has something meaningful to display.
 * - Any unexpected exception from `new Date()` → caught and `raw` is
 *   returned as a safe fallback.
 *
 * @param raw - Date string to format (e.g. `"2024-03-15T00:00:00Z"`).
 * @returns Formatted date string or the original input if unparseable.
 */
export function formatDate(raw: string): string {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return raw;
  }
}
