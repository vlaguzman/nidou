import { describe, expect, it } from "vitest";
import { howItWorks } from "./howItWorks";

describe("howItWorks data", () => {
  it("has five steps", () => {
    expect(howItWorks.steps).toHaveLength(5);
  });

  it("has a heading and subtitle", () => {
    expect(howItWorks.heading).toBe("Así funciona");
    expect(howItWorks.subtitle.length).toBeGreaterThan(10);
  });
});
