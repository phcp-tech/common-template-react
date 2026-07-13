import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// build.manifest is intentionally omitted — it is only needed for SSR prerender
// pipelines that reference hashed asset filenames. This template is a pure SPA.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const requestedBase = env.VITE_PUBLIC_BASE_PATH || "/";
  const base = requestedBase.endsWith("/") ? requestedBase : `${requestedBase}/`;
  const appName = env.VITE_APP_NAME || "My App";

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        injectRegister: false,
        registerType: "autoUpdate",
        manifest: {
          name: appName,
          short_name: env.VITE_APP_SHORT_NAME || appName,
          id: base,
          start_url: base,
          scope: base,
          display: "standalone",
          theme_color: "#0f6a63",
          background_color: "#f7f3ea",
          icons: [
            { src: "logo192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "logo512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "logo192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
            { src: "logo512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: { cleanupOutdatedCaches: true },
      }),
    ],
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
