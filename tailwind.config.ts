import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1f2522",
        paper: "#f7f3ea",
        jade: "#0f6a63",
        "jade-700": "#074d48",
        bronze: "#b27a41",
        cloud: "#e6e0d4"
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
