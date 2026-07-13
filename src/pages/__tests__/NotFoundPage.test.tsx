import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../NotFoundPage";

describe("NotFoundPage", () => {
  it("resolves locale from the URL param when no prop is given", () => {
    render(
      <MemoryRouter initialEntries={["/zh/does-not-exist"]}>
        <Routes>
          <Route path="/:locale/*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("页面未找到")).toBeInTheDocument();
  });

  it("prefers the explicit locale prop over the URL param (top-level catch-all)", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-path"]}>
        <Routes>
          <Route path="*" element={<NotFoundPage locale="zh-Hans" />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("页面未找到")).toBeInTheDocument();
  });

  it("navigates to the locale-prefixed home when the button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/en/does-not-exist"]}>
        <Routes>
          <Route path="/:locale/*" element={<NotFoundPage />} />
          <Route path="/en/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to Homepage" }));
    expect(await screen.findByText("Home")).toBeInTheDocument();
  });
});
