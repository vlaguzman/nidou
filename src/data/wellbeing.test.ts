import { describe, expect, it } from "vitest";
import { chart, flow, wellbeing } from "./wellbeing";

describe("wellbeing data", () => {
  it("has the four-step flow", () => {
    expect(flow).toHaveLength(4);
  });

  it("has one label per chart value, and values stay within 0-100", () => {
    expect(chart.labels).toHaveLength(chart.values.length);
    for (const v of chart.values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it("has section copy", () => {
    expect(wellbeing.heading).toBe("Tu bienestar también merece un seguimiento.");
    expect(wellbeing.paragraphs).toHaveLength(2);
  });
});
