/**
 * Footer — site-wide footer with navigation links and copyright notice.
 * Layer: core/components/layout — no feature-layer imports.
 *
 * TODO: Replace the example.com and github.com placeholder links with your
 * own URLs in the Links and Community sections below.
 *
 * Constraint: must NOT import from features/ or pages/.
 */
import { useNavigate } from "react-router-dom";
import { LOCALE_REGISTRY } from "../../lib/locale-registry";
import type { MessageSchema } from "../../i18n/types";
import type { Locale } from "../../types/locale";

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-[1.2em] w-[1.2em] shrink-0 stroke-current"
      fill="none"
      strokeWidth="1.2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H3v10h10V8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.5 13 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 3h3v3" />
    </svg>
  );
}

export type FooterProps = {
  footerText: MessageSchema["footer"];
  activeLocale: Locale;
};

function InternalFooterNavLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function Footer({ footerText, activeLocale }: FooterProps) {
  const localePrefix = `/${LOCALE_REGISTRY[activeLocale].urlPrefix}`;
  const termsHref = `${localePrefix}/terms`;
  const privacyHref = `${localePrefix}/privacy`;

  return (
    <footer className="relative z-10 border-t border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 text-sm text-ink/75 sm:px-6 md:px-10">
        <div className="flex flex-col gap-5 self-stretch sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/55">{footerText.links}</p>
            {/* TODO: replace with your own external links */}
            <a
              href="https://example.com"
              target="_blank"
              rel="noreferrer"
              className="footer-link inline-flex items-center gap-1"
            >
              <span className="footer-link-label">Example</span>
              <ExternalLinkIcon />
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/55">{footerText.community}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {/* TODO: replace with your own community links */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="footer-link inline-flex items-center gap-1"
              >
                <span className="footer-link-label">GitHub</span>
                <ExternalLinkIcon />
              </a>
            </div>
          </div>

          <div className="space-y-2 sm:min-w-[12rem]">
            <p className="text-xs uppercase tracking-[0.16em] text-ink/55">{footerText.legalHeading}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4">
              <InternalFooterNavLink to={termsHref} className="footer-link inline-flex w-fit items-center gap-1">
                <span className="footer-link-label">{footerText.termsOfService}</span>
              </InternalFooterNavLink>
              <InternalFooterNavLink to={privacyHref} className="footer-link inline-flex w-fit items-center gap-1">
                <span className="footer-link-label">{footerText.privacyPolicy}</span>
              </InternalFooterNavLink>
            </div>
          </div>
        </div>

        <p className="text-center font-medium text-ink/80">
          {footerText.copyright} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
