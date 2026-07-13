import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import i18n from "./core/i18n";
import { MainApp } from "./router";

afterEach(() => {
  cleanup();
});

beforeEach(async () => {
  window.history.pushState({}, "", "/zh/");
  await i18n.changeLanguage("en-US");
});

describe("MainApp locale routing", () => {
  it("synchronises i18next with a directly opened locale route", async () => {
    render(<MainApp />);

    await waitFor(() => {
      expect(i18n.language).toBe("zh-Hans");
    });
  });

  it("renders the lazy-loaded legal route on direct navigation", async () => {
    window.history.pushState({}, "", "/en/terms");
    const { findByText } = render(<MainApp />);

    // The legal page (and its react-markdown/rehype-sanitize dependencies)
    // is code-split via React.lazy; this proves the Suspense boundary
    // resolves to real content rather than hanging on the loading fallback.
    expect(await findByText("Go to Homepage")).toBeInTheDocument();
  });
});
