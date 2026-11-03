import { describe, expect, it } from "vitest";
import { finalCta } from "./finalCta";

describe("finalCta data", () => {
  it("has the form copy", () => {
    expect(finalCta.heading).toBe("Tu refugio también puede empezar aquí.");
    expect(finalCta.form.submitLabel).toBe("Únete a la comunidad");
    expect(finalCta.form.emailLabel.length).toBeGreaterThan(5);
    expect(finalCta.thanks).toContain("Gracias por tu interés");
    expect(finalCta.thanks).toContain("preparando la comunidad");
    expect(finalCta.thanks).not.toContain("unirte");
  });
});
