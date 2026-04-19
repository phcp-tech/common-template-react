/**
 * i18n type definitions — generic message schema for the template.
 * To extend: add fields here, then update en-us.ts and zh-hans.ts.
 * Constraint: must NOT import from features/ or pages/.
 */
export type { Locale } from "../types/locale";

export type MessageSchema = {
  header: {
    title: string;
    subtitle: string;
    nav: { home: string };
    localeLabel: string;
    themeMode: { dark: string; light: string };
  };
  home: {
    heading: string;
    description: string;
  };
  footer: {
    copyright: string;
    links: string;
    community: string;
    legalHeading: string;
    termsOfService: string;
    privacyPolicy: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
  contentCard: {
    contentNotAvailable: string;
  };
};
