import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Markdown } from "../Markdown";

describe("Markdown", () => {
  it("opens image previews from the keyboard and restores focus after escape", async () => {
    render(<Markdown source="![Diagram](https://example.com/diagram.png)" />);

    const image = screen.getByRole("button", { name: "Open image preview: Diagram" });
    image.focus();
    fireEvent.keyDown(image, { key: "Enter" });

    expect(screen.getByRole("dialog", { name: "Image preview: Diagram" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    const closeButton = screen.getByRole("button", { name: "Close" });
    const tabEvent = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    closeButton.dispatchEvent(tabEvent);

    expect(tabEvent.defaultPrevented).toBe(true);
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Open image preview: Diagram" })).toHaveFocus();
    });
  });
});
