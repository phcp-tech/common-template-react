import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeContext } from "../../core/context/ThemeContext";
import { LegalPageWrapper } from "../LegalPageWrapper";

function renderAt(path: string, variant: "terms" | "privacy") {
  return render(
    <ThemeContext.Provider value={{ isDarkMode: false, setIsDarkMode: () => {} }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/:locale/*" element={<LegalPageWrapper variant={variant} />} />
        </Routes>
      </MemoryRouter>
    </ThemeContext.Provider>
  );
}

describe("LegalPageWrapper", () => {
  it("connects ThemeContext to LegalPage and renders the terms variant", () => {
    renderAt("/en/terms", "terms");
    expect(screen.getByText("Go to Homepage")).toBeInTheDocument();
  });

  it("renders the privacy variant", () => {
    renderAt("/en/privacy", "privacy");
    expect(screen.getByText("Go to Homepage")).toBeInTheDocument();
  });
});
