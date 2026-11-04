import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getTestimonials } from "./testimonials";

describe("testimonials data", () => {
  it("has three testimonials with unique names in every locale", () => {
    for (const lang of ["es", "en"] as const) {
      const { items } = getTestimonials(lang);
      expect(items).toHaveLength(3);
      expect(new Set(items.map((t) => t.name)).size).toBe(3);
      expect(items.map((t) => t.name)).toEqual(["Laura", "Ana", "Annie"]);
    }
  });

  it("uses the workshop names as details", () => {
    expect(getTestimonials("es").items.map((t) => t.detail)).toEqual([
      "Cita con el artista",
      "Presencia compartida",
      "Presencia compartida",
    ]);
    expect(getTestimonials("en").items.map((t) => t.detail)).toEqual([
      "Date with the artist",
      "Shared presence",
      "Shared presence",
    ]);
  });

  it("marks only the long quote as collapsible", () => {
    for (const lang of ["es", "en"] as const) {
      expect(getTestimonials(lang).items.filter((t) => t.collapsible).map((t) => t.name)).toEqual(["Laura"]);
    }
  });

  it("has expand labels", () => {
    expect(getTestimonials("es").expand).toEqual({ more: "Leer más", less: "Leer menos" });
    expect(getTestimonials("en").expand).toEqual({ more: "Read more", less: "Read less" });
  });

  it("has the same shape in both locales", () => {
    expect(shape(getTestimonials("en"))).toEqual(shape(getTestimonials("es")));
  });
});
