/**
 * LocaleMenu — custom locale dropdown.
 *
 * A native <select> opens the OS picker on phones (a full-width dark sheet),
 * which ignores the site's theme. This menu renders in the page instead.
 * Closes on outside pointer-down, on Escape and after a selection.
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { localeLabels, localeList } from "../../i18n";
import type { Locale } from "../../types/locale";

export type LocaleMenuProps = {
  activeLocale: Locale;
  /** Accessible name of the trigger and the menu, e.g. "Language". */
  label: string;
  onChange: (locale: Locale) => void;
  /** Extra classes for the root element (e.g. width limits). */
  className?: string;
};

export function LocaleMenu({ activeLocale, label, onChange, className = "" }: LocaleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full min-w-0 items-center justify-between gap-1.5 rounded-full border border-ink/15 bg-surface/80 px-3 py-1.5 text-xs text-ink transition-colors hover:text-jade"
      >
        <span className="truncate">{localeLabels[activeLocale]}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 text-ink/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={label}
          className="absolute right-0 top-full z-50 mt-2 min-w-[8.5rem] overflow-hidden rounded-lg border border-ink/10 bg-surface py-1 shadow-lg"
        >
          {localeList.map((item) => {
            const isActive = item === activeLocale;
            return (
              <button
                key={item}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setIsOpen(false);
                  onChange(item);
                }}
                className={`block w-full whitespace-nowrap px-4 py-2 text-left text-xs transition-colors hover:bg-ink/5 hover:text-jade ${
                  isActive ? "font-medium text-jade" : "text-ink/80"
                }`}
              >
                {localeLabels[item]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
