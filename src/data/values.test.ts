import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getValues } from "./values";

describe("values data", () => {
  it("has a heading and three values", () => {
    const es = getValues("es");
    expect(es.heading.length).toBeGreaterThan(10);
    expect(es.items.map((v) => v.title)).toEqual(["Escucharte", "Conectar", "Crecer"]);
    expect(getValues("en").items.map((v) => v.title)).toEqual(["Listen to yourself", "Connect", "Grow"]);
  });

  it("gives every value an icon and text", () => {
    for (const lang of ["es", "en"] as const) {
      for (const value of getValues(lang).items) {
        expect(value.icon).toBeDefined();
        expect(value.text.length).toBeGreaterThan(10);
      }
    }
  });

  it("has the same shape in both locales", () => {
    expect(shape(getValues("en"))).toEqual(shape(getValues("es")));
  });
});
