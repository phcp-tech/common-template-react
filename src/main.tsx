/**
 * Client entry point — mounts the React SPA.
 * No SSR hydration in the template; use createRoot unconditionally.
 */
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { MainApp } from "./router";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root container.");

createRoot(container).render(<MainApp />);

registerSW({ immediate: true });
