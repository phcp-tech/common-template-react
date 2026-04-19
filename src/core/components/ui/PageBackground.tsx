/**
 * PageBackground — decorative background layer for light-mode pages.
 *
 * Layer: core/components/ui — stateless presentational atom.
 *
 * Renders two absolutely-positioned, pointer-events-disabled `<div>` layers:
 * 1. A radial-gradient + linear-gradient warm parchment effect.
 * 2. A subtle grid overlay using `background-image` with repeating lines.
 *
 * The component renders nothing (`null`) when `show` is `false`, so callers
 * can pass `!isDarkMode` and the background disappears automatically in dark
 * mode without any wrapper conditional.
 *
 * Both layers use `pointer-events-none` to ensure they do not intercept
 * mouse/touch events that belong to content above them.
 *
 * Constraint: must NOT import from features/ or pages/.
 */

/**
 * @param show - When `false` the component renders `null` (e.g. in dark mode).
 */
export function PageBackground({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(15,106,99,0.16),transparent_45%),radial-gradient(circle_at_82%_14%,rgba(178,122,65,0.18),transparent_38%),linear-gradient(180deg,#fbf8f1_0%,#f3efe5_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(31,37,34,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(31,37,34,0.03)_1px,transparent_1px)] [background-size:28px_28px]" />
    </>
  );
}
