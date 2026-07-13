import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LegalPage } from "../LegalPage";

function renderAt(path: string, variant: "terms" | "privacy") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/:locale/*" element={<LegalPage variant={variant} isDarkMode={false} />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("LegalPage", () => {
  it("renders the English terms document with a link back home", () => {
    renderAt("/en/terms", "terms");
    expect(screen.getByText("Go to Homepage")).toBeInTheDocument();
  });

  it("renders the Simplified Chinese privacy document", () => {
    renderAt("/zh/privacy", "privacy");
    expect(screen.getByText("返回首页")).toBeInTheDocument();
  });
});
