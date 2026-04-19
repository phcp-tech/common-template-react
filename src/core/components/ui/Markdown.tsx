/**
 * Markdown — safe, feature-rich Markdown renderer.
 *
 * Layer: core/components/ui — stateless presentational atom.
 *
 * Pipeline:
 *   remark-gfm        → parse GitHub Flavoured Markdown (tables, task lists,
 *                        strikethrough, autolinks)
 *   rehype-sanitize   → strip dangerous HTML; custom schema extends the
 *                        default allowlist to include GFM table elements,
 *                        task-list checkboxes, images, and className attributes
 *                        required by highlight.js.
 *   rehype-highlight  → syntax-highlight fenced code blocks via highlight.js.
 *
 * Custom component overrides:
 *   `a`     — opens external links (http/https) in a new tab with
 *             `rel="noopener noreferrer"` to prevent opener attacks.
 *   `input` — task-list checkboxes are rendered `disabled` so they cannot be
 *             toggled by the user.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

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
 * support GFM output (tables, task lists) and highlight.js class names.
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
    // Allow className for highlight.js and basic styling hooks
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

const rehypePlugins: any = [
  [rehypeSanitize, sanitizeSchema],
  [
    rehypeHighlight,
    {
      // If a fence has no language, highlight.js won't throw; it will auto-detect.
      // If you prefer no auto-detect, set this to false.
      detect: true,
      ignoreMissing: true
    }
  ]
];

/**
 * Renders a Markdown string as sanitised HTML with syntax highlighting.
 *
 * @param source    - Raw Markdown string (`null`/`undefined` treated as empty).
 * @param className - Optional CSS class for the outer wrapper element.
 */
export function Markdown({ source, className }: MarkdownProps) {
  // Normalise null/undefined to an empty string so ReactMarkdown never
  // receives a non-string child.
  const value = typeof source === "string" ? source : "";

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          // Custom link renderer: external URLs open in a new tab with
          // security attributes; same-origin links behave normally.
          a: ({ href, children, ...props }) => {
            // Detect external links by checking for an http(s) scheme
            const isExternal = typeof href === "string" && /^https?:\/\//i.test(href);
            return (
              <a
                href={href}
                {...props}
                target={isExternal ? "_blank" : props.target}
                // noopener prevents the new tab from accessing window.opener;
                // noreferrer additionally suppresses the Referer header.
                rel={isExternal ? "noopener noreferrer" : props.rel}
              >
                {children}
              </a>
            );
          },
          // Ensure task list checkbox can't be interacted with
          input: (props) => {
            // Inspect the underlying HAST node to distinguish task-list
            // checkboxes (generated by remark-gfm) from other <input> tags.
            const node = (props as any).node as any;
            const isCheckbox = node?.properties?.type === "checkbox";
            if (!isCheckbox) {
              return <input {...props} />;
            }
            // Force task-list checkboxes to be read-only in the rendered output
            return <input {...props} disabled />;
          }
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
}
