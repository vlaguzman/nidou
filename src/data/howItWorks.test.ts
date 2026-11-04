import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getHowItWorks } from "./howItWorks";

describe("howItWorks data", () => {
  it("has five steps in every locale", () => {
    expect(getHowItWorks("es").steps).toHaveLength(5);
    expect(getHowItWorks("en").steps).toHaveLength(5);
  });

  it("has a heading and subtitle", () => {
    expect(getHowItWorks("es").heading).toBe("Así funciona");
    expect(getHowItWorks("es").subtitle.length).toBeGreaterThan(10);
    expect(getHowItWorks("en").heading).toBe("How it works");
  });

  it("has the same shape in both locales", () => {
    expect(shape(getHowItWorks("en"))).toEqual(shape(getHowItWorks("es")));
  });
});
