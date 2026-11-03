import { describe, expect, it } from "vitest";
import { CHART, areaPath, buildPoints, smoothPath } from "./chart";

describe("chart geometry", () => {
  it("spreads points across the inner width", () => {
    const points = buildPoints([0, 50, 100]);
    expect(points).toHaveLength(3);
    expect(points[0].x).toBe(CHART.padX);
    expect(points[2].x).toBe(CHART.width - CHART.padX);
  });

  it("maps higher values to a smaller y (higher on screen)", () => {
    const [low, high] = buildPoints([10, 90]);
    expect(high.y).toBeLessThan(low.y);
    expect(buildPoints([100])[0].y).toBe(CHART.padY);
  });

  it("builds a smooth cubic path from the points", () => {
    const d = smoothPath([
      { x: 0, y: 10 },
      { x: 10, y: 20 },
    ]);
    expect(d).toBe("M 0 10 C 5 10, 5 20, 10 20");
  });

  it("returns an empty path for fewer than two points", () => {
    expect(smoothPath([{ x: 1, y: 1 }])).toBe("");
  });

  it("closes the area down to the baseline", () => {
    const points = buildPoints([20, 80]);
    const area = areaPath(points);
    expect(area.startsWith(smoothPath(points))).toBe(true);
    expect(area.endsWith("Z")).toBe(true);
    expect(area).toContain(`${CHART.height - CHART.padY}`);
  });
});
