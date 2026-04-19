import { describe, it, expect } from "vitest";
import { formatDate } from "../date";

describe("formatDate", () => {
  // --- Empty / falsy input ---
  it("returns empty string for empty string input", () => {
    expect(formatDate("")).toBe("");
  });

  // --- Valid dates ---
  // Use T12:00:00Z (noon UTC) so the local calendar date is unambiguous
  // in any timezone (avoids UTC midnight rollover to the previous day).
  it("formats a full ISO-8601 datetime string", () => {
    expect(formatDate("2024-03-15T12:00:00Z")).toBe("2024/3/15");
  });

  it("formats a date string without zero-padding on month and day", () => {
    // March = month index 2 → getMonth()+1 = 3 (no zero-pad)
    expect(formatDate("2024-03-05T12:00:00Z")).toBe("2024/3/5");
  });

  it("formats December 25 correctly", () => {
    expect(formatDate("2024-12-25T12:00:00Z")).toBe("2024/12/25");
  });

  // --- Invalid / unparseable input ---
  it("returns the original string when the date is unparseable", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("returns the original string for an out-of-range date", () => {
    // "2024-99-99" produces Invalid Date on all major JS engines.
    expect(formatDate("2024-99-99")).toBe("2024-99-99");
  });
});
