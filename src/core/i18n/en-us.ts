/**
 * English (United States) translations for the template.
 * Replace placeholder values with your own content.
 * Constraint: must NOT import from features/ or pages/.
 */
import type { MessageSchema } from "./types";

export const enUS: MessageSchema = {
  header: {
    title: "My App",
    subtitle: "My App",
    nav: { home: "Home" },
    localeLabel: "Language",
    themeMode: { dark: "Dark mode", light: "Light mode" },
  },
  home: {
    heading: "Welcome",
    description: "This is a template. Replace this content with your own.",
  },
  footer: {
    copyright: "Copyright © Your Company",
    links: "Links",
    community: "Community",
    legalHeading: "Legal",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
  },
  notFound: {
    title: "Page Not Found",
    message: "The page you are looking for does not exist or has been moved.",
    goHome: "Go to Homepage",
  },
  contentCard: {
    contentNotAvailable: "Content not available.",
  },
};
