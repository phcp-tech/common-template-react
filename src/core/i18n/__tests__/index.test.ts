import { describe, it, expect } from "vitest";
import { messages, localeLabels, localeList } from "../index";

describe("messages map", () => {
  it("provides en-US messages", () => {
    expect(messages["en-US"].header.title).toBe("My App");
    expect(messages["en-US"].home.heading).toBe("Welcome");
    expect(messages["en-US"].footer.copyright).toBe("Copyright © Your Company");
    expect(messages["en-US"].notFound.goHome).toBe("Go to Homepage");
  });

  it("provides zh-Hans messages", () => {
    expect(messages["zh-Hans"].header.title).toBe("我的应用");
    expect(messages["zh-Hans"].home.heading).toBe("欢迎");
    expect(messages["zh-Hans"].notFound.goHome).toBe("返回首页");
  });

  it("all locales have all required top-level keys", () => {
    for (const locale of localeList) {
      const m = messages[locale];
      expect(m.header).toBeDefined();
      expect(m.header.title).toBeTruthy();
      expect(m.header.nav.home).toBeTruthy();
      expect(m.home).toBeDefined();
      expect(m.home.heading).toBeTruthy();
      expect(m.footer).toBeDefined();
      expect(m.footer.copyright).toBeTruthy();
      expect(m.notFound).toBeDefined();
      expect(m.notFound.goHome).toBeTruthy();
      expect(m.contentCard).toBeDefined();
      expect(m.contentCard.contentNotAvailable).toBeTruthy();
    }
  });
});

describe("localeLabels", () => {
  it("has English label for en-US", () => {
    expect(localeLabels["en-US"]).toBe("English (US)");
  });
  it("has Chinese label for zh-Hans", () => {
    expect(localeLabels["zh-Hans"]).toBe("简体中文");
  });
});

describe("localeList", () => {
  it("contains both supported locales", () => {
    expect(localeList).toContain("en-US");
    expect(localeList).toContain("zh-Hans");
  });
});
