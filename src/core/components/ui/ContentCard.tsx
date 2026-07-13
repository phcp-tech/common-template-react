/**
 * ContentCard — reusable Markdown content display card.
 *
 * Layer: core/components/ui — presentational atom with no routing or feature
 * dependencies.
 *
 * Renders Markdown content inside a styled card shell. Supports two visual
 * variants:
 * - `"default"` — used on article detail pages (larger padding, tighter
 *   border radius).
 * - `"compact"` — used on the home page for compact content previews.
 *
 * When `content` is absent the card renders a fallback: either the caller's
 * custom `placeholder` node or the i18n "content not available" message.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import { Markdown } from "./Markdown";
import { messages } from "../../i18n";
import type { Locale } from "../../types/locale";

export type ContentCardProps = {
  /** Markdown content source. */
  content?: string | null;
  /** Whether dark mode is active. */
  isDarkMode: boolean;
  /** Active locale, used to resolve the placeholder message. */
  locale: Locale;
  /** Visual variant. */
  variant?: "default" | "compact";
  /** Additional class names merged onto the card shell. */
  className?: string;
  /** Custom placeholder rendered when `content` is absent. */
  placeholder?: React.ReactNode;
};

/**
 * ContentCard - reusable Markdown content display card.
 *
 * Supports two visual variants:
 * - default: standard styling, used on article detail pages.
 * - compact: tighter styling, used for home-page content previews.
 */
export function ContentCard({
  content,
  isDarkMode,
  locale,
  variant = "default",
  className = "",
  placeholder,
}: ContentCardProps) {
  const t = messages[locale];

  const baseStyles = variant === "default"
    ? "rounded-2xl border border-ink/10 bg-surface/80 p-5 shadow-md backdrop-blur-sm sm:p-6 md:p-9"
    : "rounded-xl border border-ink/10 bg-surface/65 p-4 shadow-md transition-all duration-200 hover:shadow-md";

  if (!content) {
    return (
      <div
        className={`${baseStyles} ${className}`}
        data-color-mode={isDarkMode ? "dark" : "light"}
      >
        {placeholder || (
          <div className="text-center py-12 text-ink/50">
            <p>{t.contentCard.contentNotAvailable}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} space-y-4 ${className}`}
      data-color-mode={isDarkMode ? "dark" : "light"}
    >
      <div className="wmde-markdown-wrapper">
        <Markdown source={content} />
      </div>
    </div>
  );
}
