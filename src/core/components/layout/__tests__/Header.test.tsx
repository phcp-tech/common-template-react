import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../Header";

describe("Header", () => {
  it("exposes accessible theme and locale controls", () => {
    render(
      <MemoryRouter>
        <Header
          activeLocale="en-US"
          isDarkMode={false}
          setIsDarkMode={() => {}}
          currentPage="home"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Dark mode" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveValue("en-US");
  });
});
