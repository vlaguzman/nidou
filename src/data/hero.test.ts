import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getHero } from "./hero";
import { sectionIds } from "./site";

describe("hero data", () => {
  it("has the headline in two parts", () => {
    const es = getHero("es");
    expect(es.headline.lead).toBe("La maternidad nos transforma.");
    expect(es.headline.accent).toBe("La comunidad nos sostiene.");
    const en = getHero("en");
    expect(en.headline.lead).toBe("Motherhood transforms us.");
    expect(en.headline.accent).toBe("Community holds us.");
  });

  it("has no eyebrow or description", () => {
    expect(getHero("es")).not.toHaveProperty("eyebrow");
    expect(getHero("es")).not.toHaveProperty("description");
  });

  it("labels the secondary CTA", () => {
    expect(getHero("es").secondaryCta.label).toBe("Descubre Nidou.");
    expect(getHero("en").secondaryCta.label).toBe("Discover Nidou.");
  });

  it("points the primary CTA to the community form and the secondary to a section", () => {
    for (const lang of ["es", "en"] as const) {
      const hero = getHero(lang);
      expect(hero.primaryCta.href).toBe("https://docs.google.com/forms/d/e/1FAIpQLSc5gm7dmLdB6mSSAJpODuWG0phQUaINnxYfgAkG6Y7771pWcQ/viewform");
      expect(hero.secondaryCta.href).toBe(`#${sectionIds.comoFunciona}`);
    }
  });

  it("describes the hero image", () => {
    for (const lang of ["es", "en"] as const) {
      const { image } = getHero(lang);
      expect(image.src).toMatch(/^\/images\/.+\.webp$/);
      expect(image.alt.length).toBeGreaterThan(10);
    }
    expect(getHero("en").image.src).toBe(getHero("es").image.src);
  });

  it("has the same shape in both locales", () => {
    expect(shape(getHero("en"))).toEqual(shape(getHero("es")));
  });
});
