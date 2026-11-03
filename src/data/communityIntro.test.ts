import { describe, expect, it } from "vitest";
import { communityIntro } from "./communityIntro";

describe("communityIntro data", () => {
  it("uses the NIDOU logo asset", () => {
    expect(communityIntro.logo.src).toBe("/nidou-logo.webp");
    expect(communityIntro.logo.alt).toBe("NIDOU");
  });

  it("has the statement and supporting copy", () => {
    expect(communityIntro.statement).toMatch(/^es una comunidad/);
    expect(communityIntro.supporting).toMatch(/^No solo importa/);
  });
});
