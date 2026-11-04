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
    expect(finalCta.thanks).toContain("preparando la comunidad");
    expect(finalCta.thanks).not.toContain("unirte");
  });

  it("has the English form copy", () => {
    const finalCta = getFinalCta("en");
    expect(finalCta.heading.length).toBeGreaterThan(10);
    expect(finalCta.form.submitLabel).toBe("Join the community");
    expect(finalCta.thanks).toContain("Thank you for your interest");
  });

  it("has the same shape in both locales", () => {
    expect(shape(getFinalCta("en"))).toEqual(shape(getFinalCta("es")));
  });
});
