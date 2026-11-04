import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getGallery } from "./gallery";

describe("gallery data", () => {
  it("has seven photos with unique sources and alt text in every locale", () => {
    for (const lang of ["es", "en"] as const) {
      const { photos } = getGallery(lang);
      expect(photos).toHaveLength(7);
      expect(new Set(photos.map((p) => p.src)).size).toBe(7);
      for (const photo of photos) {
        expect(photo.src).toMatch(/^\/images\/gallery-.+\.webp$/);
        expect(photo.alt.length).toBeGreaterThan(10);
      }
    }
  });

  it("only tall-flags photos with a known span", () => {
    for (const photo of getGallery("es").photos) {
      expect([undefined, "tall"]).toContain(photo.layout);
    }
  });

  it("shares sources and layout across locales, translating only the alt text", () => {
    const es = getGallery("es").photos;
    const en = getGallery("en").photos;
    expect(en.map((p) => [p.src, p.layout])).toEqual(es.map((p) => [p.src, p.layout]));
    expect(en.map((p) => p.alt)).not.toEqual(es.map((p) => p.alt));
  });

  it("has the same shape in both locales", () => {
    expect(shape(getGallery("en"))).toEqual(shape(getGallery("es")));
  });
});
