import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// build.manifest is intentionally omitted — it is only needed for SSR prerender
// pipelines that reference hashed asset filenames. This template is a pure SPA.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const requestedBase = env.VITE_PUBLIC_BASE_PATH || "/";
  const base = requestedBase.endsWith("/") ? requestedBase : `${requestedBase}/`;

  return {
    base,
    plugins: [react()],
  assetsInclude: ["**/*.md"],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-i18n": ["i18next", "react-i18next"],
          "vendor-markdown": ["react-markdown", "remark-gfm", "rehype-sanitize"],
        },
      },
    },
  },
  };
});
