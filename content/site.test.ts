// content/site.test.ts
import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("site content", () => {
  it("has 5 benefits", () => {
    expect(site.benefits).toHaveLength(5);
  });

  it("has 4 offerings", () => {
    expect(site.offerings).toHaveLength(4);
  });

  it("keeps the shloka verbatim", () => {
    expect(site.hero.shlokaLines).toEqual([
      "सर्वं शान्तं शिवं ब्रह्म",
      "नादे लीनं निरामयम्।",
    ]);
  });

  it("has the correct WhatsApp number", () => {
    expect(site.contact.whatsappNumber).toBe("918368426330");
  });
});
