/**
 * Vite environment type declarations.
 *
 * Role: This triple-slash reference pulls in Vite's ambient type definitions
 * for the current project, which includes:
 *   - The `ImportMeta` interface augmentation that types `import.meta.env`
 *     (e.g. VITE_* environment variables, MODE, BASE_URL, DEV, PROD, SSR).
 *   - Type declarations for static asset imports (e.g. `import url from './img.png'`).
 *
 * Constraints:
 *   - This file must be present in the TypeScript compilation root so that
 *     `import.meta.env.*` accesses are fully typed throughout the project.
 *   - Do not add runtime code here — it is a pure ambient declaration file.
 */
/// <reference types="vite/client" />
