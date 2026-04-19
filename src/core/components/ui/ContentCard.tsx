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
  /** Markdown内容源 */
  content?: string | null;
  /** 是否为暗色模式 */
  isDarkMode: boolean;
  /** 语言设置 */
  locale: Locale;
  /** 卡片样式变体 */
  variant?: "default" | "compact";
  /** 自定义类名 */
  className?: string;
  /** 内容不可用时的占位内容 */
  placeholder?: React.ReactNode;
};

/**
 * ContentCard - 可复用的文章内容显示组件
 *
 * 用于统一显示Markdown格式的内容，支持两种样式变体：
 * - default: 标准样式，用于文章详情页面
 * - compact: 紧凑样式，用于首页内容预览
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

  // 根据变体选择样式
  const baseStyles = variant === "default"
    ? "rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-md backdrop-blur-sm sm:p-6 md:p-9"
    : "rounded-xl border border-gray-200 bg-white/65 p-4 shadow-md transition-all duration-200 hover:shadow-md";

  // 如果没有内容，显示占位符
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
