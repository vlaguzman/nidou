import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getTestimonials } from "./testimonials";

describe("testimonials data", () => {
  it("has four testimonials with unique names in every locale", () => {
    for (const lang of ["es", "en"] as const) {
      const { items } = getTestimonials(lang);
      expect(items).toHaveLength(4);
      expect(new Set(items.map((t) => t.name)).size).toBe(4);
      expect(items.map((t) => t.name)).toEqual(["Laura", "Ana", "Annie", "Fer"]);
    }
  });

  it("uses the workshop names or the role as details", () => {
    expect(getTestimonials("es").items.map((t) => t.detail)).toEqual([
      "Cita con el artista",
      "Presencia compartida",
      "Presencia compartida",
      "Compañera de equipo",
    ]);
    expect(getTestimonials("en").items.map((t) => t.detail)).toEqual([
      "Date with the artist",
      "Shared presence",
      "Shared presence",
      "Team partner",
    ]);
  });

  it("marks only the long quote as collapsible", () => {
    for (const lang of ["es", "en"] as const) {
      expect(getTestimonials(lang).items.filter((t) => t.collapsible).map((t) => t.name)).toEqual(["Laura"]);
    }
  });

  it("has Fer's testimonial in both locales", () => {
    expect(getTestimonials("es").items[3].quote).toMatch(/^En Nidou encontré la oportunidad de colaborar con sus redes sociales/);
    expect(getTestimonials("es").items[3].quote).toContain("ha sido emocionante");
    expect(getTestimonials("en").items[3].quote).toMatch(/^At Nidou I found the chance to collaborate on its social media/);
  });

  it("has carousel control labels", () => {
    expect(getTestimonials("es").carousel).toEqual({
      label: "Testimonios",
      previous: "Testimonio anterior",
      next: "Siguiente testimonio",
      pause: "Pausar carrusel",
      play: "Reproducir carrusel",
    });
    expect(getTestimonials("en").carousel.next).toBe("Next testimonial");
  });

  it("has expand labels", () => {
    expect(getTestimonials("es").expand).toEqual({ more: "Leer más", less: "Leer menos" });
    expect(getTestimonials("en").expand).toEqual({ more: "Read more", less: "Read less" });
  });

  it("has the same shape in both locales", () => {
    expect(shape(getTestimonials("en"))).toEqual(shape(getTestimonials("es")));
  });
});
