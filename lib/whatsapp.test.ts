import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me URL with the name and interest, URL-encoded", () => {
    const url = buildWhatsAppUrl({
      name: "Asha",
      interest: "Personal Experiences",
      message: "",
    });
    expect(url).toBe(
      "https://wa.me/918368426330?text=Hi%2C%20I'm%20Asha.%20I'm%20interested%20in%3A%20Personal%20Experiences."
    );
  });

  it("appends the message when provided", () => {
    const url = buildWhatsAppUrl({
      name: "Ravi",
      interest: "Workplace Well-being",
      message: "Looking for a team session.",
    });
    expect(url).toContain(encodeURIComponent("Looking for a team session."));
    expect(url.startsWith("https://wa.me/918368426330?text=")).toBe(true);
  });

  it("omits the trailing space when message is empty", () => {
    const url = buildWhatsAppUrl({
      name: "Priya",
      interest: "Community Gatherings",
      message: "",
    });
    const decoded = decodeURIComponent(url.split("text=")[1]);
    expect(decoded.endsWith(".")).toBe(true);
  });
});
