import { describe, expect, it } from "vitest";
import { testimonials } from "./testimonials";

describe("testimonials data", () => {
  it("has three testimonials with unique names", () => {
    expect(testimonials.items).toHaveLength(3);
    expect(new Set(testimonials.items.map((t) => t.name)).size).toBe(3);
    expect(testimonials.items.map((t) => t.name)).toEqual(["Laura", "Ana", "Annie"]);
  });

  it("uses the workshop names as details", () => {
    expect(testimonials.items.map((t) => t.detail)).toEqual([
      "Cita con el artista",
      "Presencia compartida",
      "Presencia compartida",
    ]);
  });

  it("marks only the long quote as collapsible", () => {
    expect(testimonials.items.filter((t) => t.collapsible).map((t) => t.name)).toEqual(["Laura"]);
  });

  it("has expand labels", () => {
    expect(testimonials.expand).toEqual({ more: "Leer más", less: "Leer menos" });
  });
});
