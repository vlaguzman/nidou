import { describe, expect, it } from "vitest";
import { hero } from "./hero";
import { sectionIds } from "./site";

describe("hero data", () => {
  it("has the headline in two parts", () => {
    expect(hero.headline.lead).toBe("La maternidad nos transforma.");
    expect(hero.headline.accent).toBe("La comunidad nos sostiene.");
  });

  it("has no eyebrow or description", () => {
    expect(hero).not.toHaveProperty("eyebrow");
    expect(hero).not.toHaveProperty("description");
  });

  it("labels the secondary CTA", () => {
    expect(hero.secondaryCta.label).toBe("Descubre Nidou.");
  });

  it("points both CTAs to existing sections", () => {
    expect(hero.primaryCta.href).toBe(`#${sectionIds.unete}`);
    expect(hero.secondaryCta.href).toBe(`#${sectionIds.comoFunciona}`);
  });

  it("describes the hero image", () => {
    expect(hero.image.src).toMatch(/^\/images\/.+\.webp$/);
    expect(hero.image.alt.length).toBeGreaterThan(10);
  });
});
