import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // happy-dom provides browser APIs (document, window, navigator) without
    // a real browser. We use it in place of jsdom because jsdom@29 ships
    // @exodus/bytes as a pure-ESM package that conflicts with CJS require()
    // in html-encoding-sniffer, causing worker startup failures.
    environment: "happy-dom",
    // Inject Vitest globals (describe, it, expect, vi) without explicit imports.
    globals: true,
    // Run the setup file before every test suite.
    setupFiles: ["./src/tests/setup.ts"],
    // jsdom 29 ships @exodus/bytes as a pure-ESM package, but
    // html-encoding-sniffer (a jsdom peer) loads it via CJS require().
    // Inlining it through Vite's ESM transform pipeline resolves the conflict.
    server: {
      deps: {
        inline: ["@exodus/bytes"],
      },
    },
  },
});
