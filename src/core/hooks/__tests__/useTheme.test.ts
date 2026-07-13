import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "../useTheme";

const THEME_KEY = "app-theme-mode";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("theme-dark");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useTheme", () => {
  it("initialises to light mode by default", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDarkMode).toBe(false);
  });

  it("initialises to dark mode when localStorage has 'dark'", () => {
    localStorage.setItem(THEME_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    expect(result.current.isDarkMode).toBe(true);
  });

  it("adds theme-dark class to documentElement when enabled", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setIsDarkMode(true));
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
  });

  it("removes theme-dark class from documentElement when disabled", () => {
    localStorage.setItem(THEME_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setIsDarkMode(false));
    expect(document.documentElement.classList.contains("theme-dark")).toBe(false);
  });

  it("persists 'dark' to localStorage when enabled", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setIsDarkMode(true));
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("persists 'light' to localStorage when disabled", () => {
    localStorage.setItem(THEME_KEY, "dark");
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setIsDarkMode(false));
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("keeps the theme usable when browser storage is unavailable", () => {
    const unavailableStorage = {
      getItem: () => { throw new DOMException("Storage is unavailable", "SecurityError"); },
      setItem: () => { throw new DOMException("Storage is unavailable", "SecurityError"); },
    } as unknown as Storage;
    vi.spyOn(window, "localStorage", "get").mockReturnValue(unavailableStorage);

    const { result } = renderHook(() => useTheme());

    expect(result.current.isDarkMode).toBe(false);
    act(() => result.current.setIsDarkMode(true));
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
  });
});
