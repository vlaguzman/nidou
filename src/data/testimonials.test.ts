import { describe, expect, it } from "vitest";
import { testimonials } from "./testimonials";

describe("testimonials data", () => {
  it("has three testimonials with unique names", () => {
    expect(testimonials.items).toHaveLength(3);
    expect(new Set(testimonials.items.map((t) => t.name)).size).toBe(3);
  });
});
