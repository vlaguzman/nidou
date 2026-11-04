import { describe, expect, it } from "vitest";
import { shape } from "./shape";

describe("shape", () => {
  it("ignores text but keeps keys and array lengths", () => {
    expect(shape({ a: "x", b: ["y", "z"] })).toEqual(shape({ a: "other", b: ["1", "2"] }));
    expect(shape({ a: "x", b: ["y"] })).not.toEqual(shape({ a: "x", b: ["y", "z"] }));
    expect(shape({ a: "x" })).not.toEqual(shape({ a: "x", b: "y" }));
  });

  it("treats class instances and functions as opaque or by type", () => {
    class Icon {}
    expect(shape({ icon: new Icon() })).toEqual({ icon: "opaque" });
    expect(shape(null)).toBe("object");
    expect(shape(() => 1)).toBe("function");
  });
});
