import { describe, it, expect, beforeEach } from "vitest";
import {
  toSupportedLocale,
  getLocaleHref,
  getLocaleFromPath,
  setLocaleCookie,
  getLocaleCookie,
  getInitialLocale,
  COOKIE_LOCALE_KEY,
} from "../locale";

beforeEach(() => {
  document.cookie = `${COOKIE_LOCALE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
});

describe("COOKIE_LOCALE_KEY", () => {
  it("uses generic app_locale key", () => {
    expect(COOKIE_LOCALE_KEY).toBe("app_locale");
  });
});

describe("toSupportedLocale", () => {
  it("maps zh-Hans to zh-Hans", () => expect(toSupportedLocale("zh-Hans")).toBe("zh-Hans"));
  it("maps zh-TW to zh-Hans via bcpPrefix", () => expect(toSupportedLocale("zh-TW")).toBe("zh-Hans"));
  it("maps zh-HK to zh-Hans via bcpPrefix", () => expect(toSupportedLocale("zh-HK")).toBe("zh-Hans"));
  it("maps en-US to en-US", () => expect(toSupportedLocale("en-US")).toBe("en-US"));
  it("maps en-GB to en-US via bcpPrefix", () => expect(toSupportedLocale("en-GB")).toBe("en-US"));
  it("falls back to en-US for unknown locale", () => expect(toSupportedLocale("fr-FR")).toBe("en-US"));
  it("falls back to en-US for undefined", () => expect(toSupportedLocale(undefined)).toBe("en-US"));
  it("falls back to en-US for null", () => expect(toSupportedLocale(null)).toBe("en-US"));
});

describe("getLocaleHref", () => {
  it("returns /zh/ for zh-Hans", () => expect(getLocaleHref("zh-Hans")).toBe("/zh/"));
  it("returns /en/ for en-US", () => expect(getLocaleHref("en-US")).toBe("/en/"));
});

describe("getLocaleFromPath", () => {
  it("infers zh-Hans from /zh/page", () => expect(getLocaleFromPath("/zh/page")).toBe("zh-Hans"));
  it("infers en-US from /en/terms", () => expect(getLocaleFromPath("/en/terms")).toBe("en-US"));
  it("falls back to en-US for bare /", () => expect(getLocaleFromPath("/")).toBe("en-US"));
  it("falls back to en-US for unknown prefix", () => expect(getLocaleFromPath("/fr/page")).toBe("en-US"));
});

describe("cookie round-trip", () => {
  it("stores and retrieves zh-Hans locale", () => {
    setLocaleCookie("zh-Hans");
    expect(getLocaleCookie()).toBe("zh-Hans");
  });
  it("stores and retrieves en-US locale", () => {
    setLocaleCookie("en-US");
    expect(getLocaleCookie()).toBe("en-US");
  });
  it("returns null when no cookie set", () => {
    expect(getLocaleCookie()).toBeNull();
  });
});

describe("getInitialLocale", () => {
  it("returns cookie locale when set", () => {
    setLocaleCookie("zh-Hans");
    expect(getInitialLocale()).toBe("zh-Hans");
  });
  it("falls back to en-US when no cookie is set", () => {
    expect(getInitialLocale()).toBe("en-US");
  });
});
