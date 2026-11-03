import { describe, expect, it } from "vitest";
import { values, valuesHeading } from "./values";

describe("values data", () => {
  it("has a heading and three values", () => {
    expect(valuesHeading.length).toBeGreaterThan(10);
    expect(values.map((v) => v.title)).toEqual(["Escucharte", "Conectar", "Crecer"]);
  });

  it("gives every value an icon and text", () => {
    for (const value of values) {
      expect(value.icon).toBeDefined();
      expect(value.text.length).toBeGreaterThan(10);
    }
  });
});
