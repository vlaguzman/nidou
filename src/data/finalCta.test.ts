import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getFinalCta } from "./finalCta";

describe("finalCta data", () => {
  it("has the Spanish form copy", () => {
    const finalCta = getFinalCta("es");
    expect(finalCta.heading).toBe("Tu refugio también puede empezar aquí.");
    expect(finalCta.form.submitLabel).toBe("Únete a la comunidad");
    expect(finalCta.form.emailLabel.length).toBeGreaterThan(5);
    expect(finalCta.thanks).toContain("Gracias por tu interés");
    expect(finalCta.thanks).toContain("WhatsApp");
    expect(finalCta.thanks).not.toContain("unirte");
  });

  it("has the English form copy", () => {
    const finalCta = getFinalCta("en");
    expect(finalCta.heading.length).toBeGreaterThan(10);
    expect(finalCta.form.submitLabel).toBe("Join the community");
    expect(finalCta.thanks).toContain("Thanks for your interest");
  });

  it("sends signups to the same WhatsApp number in both locales, with the email in the message", () => {
    for (const lang of ["es", "en"] as const) {
      const { whatsapp } = getFinalCta(lang);
      expect(whatsapp.phone).toBe("+44 7950 745207");
      expect(whatsapp.message).toContain("{email}");
      expect(whatsapp.fallbackLabel.length).toBeGreaterThan(5);
    }
  });

  it("has the same shape in both locales", () => {
    expect(shape(getFinalCta("en"))).toEqual(shape(getFinalCta("es")));
  });
});
