# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A production-ready React frontend template with multi-locale support (zh-Hans / en-US), dark mode, PWA, locale-prefixed routing, and legal pages. The `core/` layer is fully portable — zero business-domain coupling, can be copied to any new project.

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for development
npm run build:dev

# Build for production
npm run build:prod

# Preview production build locally
npm run preview
```

## Directory Structure

```
src/
├── core/                     # Shared infrastructure — zero business coupling
│   ├── components/
│   │   ├── layout/           # Header, Footer, RootLayout, ErrorBoundary
│   │   ├── ui/               # LoadingSpinner, PageBackground, ContentCard, Markdown
│   │   └── legal/            # LegalPage component + placeholder markdown files
│   ├── context/              # ThemeContext (dark mode)
│   ├── hooks/                # useTheme (localStorage persistence)
│   ├── i18n/                 # MessageSchema, en-US and zh-Hans translations, i18next init
│   ├── lib/                  # locale.ts, locale-registry.ts, date.ts
│   └── types/                # Locale, OutputLocale
├── features/                 # Feature components
├── pages/                    # Thin route wrappers
│   ├── HomePage.tsx          # Replace with your own content
│   ├── LegalPageWrapper.tsx  # Connects ThemeContext to LegalPage
│   └── NotFoundPage.tsx      # 404 fallback
├── router.tsx                # Route definitions
├── main.tsx                  # SPA entry point
└── index.css                 # Global styles + dark-mode CSS variables
```

## Architecture Highlights

### Layered Architecture
- **Core Layer**: Shared infrastructure with zero business coupling, portable across projects
- **Features Layer**: Business-specific components
- **Pages Layer**: Thin route wrappers connecting features to routing

### Key Technical Features
- **Multi-locale Support**: zh-Hans / en-US with locale-prefixed routing (`/en/...`, `/zh/...`)
- **Dark Mode**: ThemeContext with localStorage persistence
- **PWA**: Service worker + Web App Manifest support
- **Internationalization**: i18next + static messages map for SSR safety
- **TypeScript**: Full type safety throughout
- **Vite 7**: Modern build tool with fast HMR

### Design Patterns
- **Prop-based Component Communication**: Feature components accept `isDarkMode` and `locale` as props for portability
- **Static Messages Map**: Zero-overhead i18n with runtime `useTranslation` hooks
- **Cookie + Navigator Detection**: Persists user preferences with sensible defaults
- **Inline Theme Script**: Runs before first paint to prevent theme flash

### API Routes
```
/                          # Home page
/:locale/legal/*            # Legal pages
/:locale/                  # Locale-specific routes
```

## Key Files

| File | Purpose |
|------|---------|
| `src/core/i18n/index.ts` | i18next initialization and message resources |
| `src/core/lib/locale-registry.ts` | Locale configuration and detection |
| `src/core/components/layout/Footer.tsx` | Footer component with branding |
| `src/core/components/legal/LegalPage.tsx` | Legal page component |
| `src/router.tsx` | Route definitions |
| `src/main.tsx` | SPA entry point |
| `vite.config.ts` | Vite build configuration |

## Development Notes

1. **Core Layer Portability**: The `core/` directory can be copied to any new project without modification
2. **Feature Components**: Should accept `isDarkMode` and `locale` as props, not context
3. **Legal Pages**: Markdown files are imported at build time via Vite `?raw`
4. **Theme Storage**: Uses `app-theme-mode` and `app_locale` storage keys to avoid collisions
5. **Testing**: Vitest with happy-dom for browser environment simulation

## Dependencies

- `react` - React 19 framework
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `i18next` - Internationalization
- `react-i18next` - React integration for i18next
- `tailwindcss` - Utility-first CSS framework
- `lucide-react` - Icons
- `react-markdown` - Markdown rendering
- `vite` - Build tool
- `vitest` - Testing framework
- `typescript` - Type checking