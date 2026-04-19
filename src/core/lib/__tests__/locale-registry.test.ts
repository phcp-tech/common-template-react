import { describe, it, expect } from "vitest";
import {
  LOCALE_REGISTRY,
  LOCALE_LIST,
  FALLBACK_LOCALE,
} from "../locale-registry";

describe("LOCALE_REGISTRY", () => {
  it("has an entry for every locale in LOCALE_LIST", () => {
    for (const key of LOCALE_LIST) {
      expect(LOCALE_REGISTRY[key]).toBeDefined();
    }
  });

  it("every entry has urlPrefix, bcpPrefix, label", () => {
    for (const key of LOCALE_LIST) {
      const entry = LOCALE_REGISTRY[key];
      expect(typeof entry.urlPrefix).toBe("string");
      expect(typeof entry.bcpPrefix).toBe("string");
      expect(typeof entry.label).toBe("string");
    }
  });

  it("FALLBACK_LOCALE is a key of LOCALE_REGISTRY", () => {
    expect(LOCALE_REGISTRY[FALLBACK_LOCALE]).toBeDefined();
  });

  it("zh-Hans urlPrefix is zh", () => {
    expect(LOCALE_REGISTRY["zh-Hans"].urlPrefix).toBe("zh");
  });

  it("en-US urlPrefix is en", () => {
    expect(LOCALE_REGISTRY["en-US"].urlPrefix).toBe("en");
  });
});
