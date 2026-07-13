/**
 * PageBackground — background layer for light-mode pages.
 *
 * Layer: core/components/ui — stateless presentational atom.
 *
 * Renders a single plain white layer behind page content (no gradients).
 *
 * The component renders nothing (`null`) when `show` is `false`, so callers
 * can pass `!isDarkMode` and the background disappears automatically in dark
 * mode without any wrapper conditional.
 *
 * Uses `pointer-events-none` so it never intercepts mouse/touch events meant
 * for content above it.
 *
 * Constraint: must NOT import from features/ or pages/.
 */

/**
 * @param show - When `false` the component renders `null` (e.g. in dark mode).
 */
export function PageBackground({ show }: { show: boolean }) {
  if (!show) return null;
  return <div className="pointer-events-none absolute inset-0 bg-white" />;
}
