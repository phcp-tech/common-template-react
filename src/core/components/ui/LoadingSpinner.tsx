/**
 * LoadingSpinner — full-viewport loading indicator.
 *
 * Layer: core/components/ui — stateless presentational atom.
 *
 * Displays an animated circular spinner centred in the screen. An optional
 * `message` prop is rendered below the spinner as explanatory text (e.g.
 * "Loading articles…").
 *
 * Constraint: must NOT import from features/ or pages/.
 */

/**
 * @param message - Optional human-readable status text displayed beneath the
 *   spinner. When omitted only the animated ring is shown.
 */
export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-paper pt-8 px-4 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-jade/30 border-t-jade" />
        {message && <p className="mt-4 text-ink/50">{message}</p>}
      </div>
    </div>
  );
}
