/**
 * Markdown — safe, feature-rich Markdown renderer.
 *
 * Layer: core/components/ui — stateless presentational atom.
 *
 * Pipeline:
 *   remark-gfm       → parse GitHub Flavoured Markdown (tables, task lists,
 *                       strikethrough, autolinks)
 *   rehype-sanitize  → strip dangerous HTML; custom schema extends the
 *                       default allowlist to include GFM table elements,
 *                       task-list checkboxes, images, and className attributes.
 *
 * Custom component overrides:
 *   `a`     — opens external links (http/https) in a new tab with
 *             `rel="noopener noreferrer"` to prevent opener attacks.
 *   `input` — task-list checkboxes are rendered `disabled` so they cannot be
 *             toggled by the user.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import React from "react";
import ReactDOM from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

/** Props for the `Markdown` component. */
export type MarkdownProps = {
  /** Raw Markdown string to render. `null` / `undefined` renders nothing. */
  source?: string | null;
  /** Optional CSS class applied to the wrapping `<div>`. */
  className?: string;
};

/**
 * Extended rehype-sanitize schema built on top of the library's safe defaults.
 * Spreads `defaultSchema` and then selectively widens the allowlist to
 * support GFM output (tables, task lists) and basic styling hooks.
 */
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    // GFM tables
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    // Task list checkboxes
    "input",
    // Rich content
    "img"
  ],
  attributes: {
    ...(defaultSchema.attributes ?? {}),
    // Allow className for basic styling hooks
    code: [...((defaultSchema.attributes as any)?.code ?? []), "className"],
    span: [...((defaultSchema.attributes as any)?.span ?? []), "className"],
    pre: [...((defaultSchema.attributes as any)?.pre ?? []), "className"],
    // Links: keep common safe attributes
    a: [...((defaultSchema.attributes as any)?.a ?? []), "href", "title", "target", "rel", "className"],
    // Images: allow basic presentation attributes
    img: [
      ...((defaultSchema.attributes as any)?.img ?? []),
      "src",
      "alt",
      "title",
      "width",
      "height",
      "loading",
      "decoding",
      "referrerpolicy",
      "className"
    ],
    // Task list checkbox attributes (rendered disabled in our renderer)
    input: ["type", "checked", "disabled"]
  },
  protocols: {
    ...(defaultSchema.protocols ?? {}),
    href: [...(((defaultSchema.protocols as any)?.href) ?? []), "http", "https", "mailto"],
    src: [...(((defaultSchema.protocols as any)?.src) ?? []), "http", "https", "data"]
  }
} as const;

const rehypePlugins: any = [[rehypeSanitize, sanitizeSchema]];

/**
 * Renders a Markdown string as sanitised HTML.
 *
 * @param source    - Raw Markdown string (`null`/`undefined` treated as empty).
 * @param className - Optional CSS class for the outer wrapper element.
 */
export function Markdown({ source, className }: MarkdownProps) {
  const value = typeof source === "string" ? source : "";
  const [lightbox, setLightbox] = React.useState<{ src: string; alt: string } | null>(null);

  React.useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <div className={className}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={rehypePlugins}
          components={{
            a: ({ href, children, ...props }) => {
              const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
              return (
                <a
                  href={href}
                  {...props}
                  target={isExternal ? "_blank" : props.target}
                  rel={isExternal ? "noopener noreferrer" : props.rel}
                >
                  {children}
                </a>
              );
            },
            input: (props) => {
              const node = (props as any).node as any;
              const isCheckbox = node?.properties?.type === "checkbox";
              if (!isCheckbox) return <input {...props} />;
              return <input {...props} disabled />;
            },
            pre: ({ children, ...props }) => (
              <pre {...props} className="overflow-x-auto">
                {children}
              </pre>
            ),
            img: ({ src, alt, ...props }) => (
              <img
                src={src}
                alt={alt ?? ""}
                {...props}
                className="max-w-full h-auto cursor-zoom-in"
                onClick={() => src && setLightbox({ src, alt: alt ?? "" })}
              />
            ),
          }}
        >
          {value}
        </ReactMarkdown>
      </div>

      {lightbox && typeof document !== "undefined"
        ? ReactDOM.createPortal(
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setLightbox(null)}
            >
              <button
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                onClick={() => setLightbox(null)}
                aria-label="Close"
              >
                ✕
              </button>
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="max-h-[90vh] max-w-[90vw] w-auto h-auto rounded shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
