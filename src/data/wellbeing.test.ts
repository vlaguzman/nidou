import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getWellbeing } from "./wellbeing";

describe("wellbeing data", () => {
  it("has the four-step flow", () => {
    expect(getWellbeing("es").flow).toHaveLength(4);
    expect(getWellbeing("en").flow).toHaveLength(4);
  });

  it("has one label per chart value, and values stay within 0-100", () => {
    for (const lang of ["es", "en"] as const) {
      const { chart } = getWellbeing(lang);
      expect(chart.labels).toHaveLength(chart.values.length);
      for (const v of chart.values) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
    }
  });

  it("shares the chart numbers across locales", () => {
    expect(getWellbeing("en").chart.values).toEqual(getWellbeing("es").chart.values);
  });

  it("has section copy", () => {
    expect(getWellbeing("es").heading).toBe("Tu bienestar también merece un seguimiento.");
    expect(getWellbeing("en").heading).toBe("Your wellbeing deserves some attention too.");
    expect(getWellbeing("es").paragraphs).toHaveLength(2);
    expect(getWellbeing("en").paragraphs).toHaveLength(2);
  });

  it("has the same shape in both locales", () => {
    expect(shape(getWellbeing("en"))).toEqual(shape(getWellbeing("es")));
  });
});
