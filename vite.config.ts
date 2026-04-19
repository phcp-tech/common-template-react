import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// build.manifest is intentionally omitted — it is only needed for SSR prerender
// pipelines that reference hashed asset filenames. This template is a pure SPA.
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.md"],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-i18n": ["i18next", "react-i18next", "i18next-browser-languagedetector"],
          "vendor-markdown": ["react-markdown", "remark-gfm", "rehype-highlight", "rehype-sanitize", "highlight.js"],
        },
      },
    },
  },
});
