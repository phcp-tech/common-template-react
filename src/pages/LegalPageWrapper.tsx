/**
 * Page component shared by the /:locale/terms and /:locale/privacy routes.
 *
 * Role: Minimal route wrapper. Reads the current theme from ThemeContext and
 * passes it along with the variant discriminant to the stateless LegalPage
 * feature component. No locale wiring is needed here because LegalPage
 * receives its locale from RootLayout via a higher-level context.
 *
 * The variant prop is supplied statically by the router ("terms" | "privacy"),
 * so this single component serves both legal document routes without branching.
 */
import { useThemeContext } from "../core/context/ThemeContext";
import { LegalPage } from "../core/components/legal/LegalPage";

/**
 * Thin wrapper that connects ThemeContext to LegalPage.
 *
 * @param variant - Discriminates between the terms-of-service ("terms") and
 *                  privacy-policy ("privacy") documents.
 */
export function LegalPageWrapper({ variant }: { variant: "terms" | "privacy" }) {
  const { isDarkMode } = useThemeContext();
  return <LegalPage variant={variant} isDarkMode={isDarkMode} />;
}
