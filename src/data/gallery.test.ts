import { describe, expect, it } from "vitest";
import { gallery } from "./gallery";

describe("gallery data", () => {
  it("has seven photos with unique sources and alt text", () => {
    expect(gallery.photos).toHaveLength(7);
    expect(new Set(gallery.photos.map((p) => p.src)).size).toBe(7);
    for (const photo of gallery.photos) {
      expect(photo.src).toMatch(/^\/images\/gallery-.+\.webp$/);
      expect(photo.alt.length).toBeGreaterThan(10);
    }
  });

  it("only tall-flags photos with a known span", () => {
    for (const photo of gallery.photos) {
      expect([undefined, "tall"]).toContain(photo.layout);
    }
  });
});
