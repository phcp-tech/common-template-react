import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ink/paper/surface resolve from CSS variables (see src/index.css) so a
        // single `.theme-dark` class swap re-themes every consumer at once —
        // no per-component dark: overrides or !important needed.
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        jade: "rgb(var(--color-jade) / <alpha-value>)",
        "jade-700": "#074d48",
        bronze: "#b27a41"
      },
      boxShadow: {
        wash: "0 18px 50px rgba(31, 37, 34, 0.08)",
        card: "0 8px 25px rgba(31, 37, 34, 0.10)"
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "line-grow": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" }
        }
      },
      animation: {
        "rise-in": "rise-in 700ms ease-out both",
        "line-grow": "line-grow 900ms ease-out both"
      }
    }
  },
  plugins: []
} satisfies Config;
