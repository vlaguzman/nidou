import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getCommunityIntro } from "./communityIntro";

describe("communityIntro data", () => {
  it("uses the NIDOU logo asset in every locale", () => {
    for (const lang of ["es", "en"] as const) {
      const { logo } = getCommunityIntro(lang);
      expect(logo.src).toBe("/nidou-logo.webp");
      expect(logo.alt).toBe("NIDOU");
    }
  });

  it("has the statement and supporting copy", () => {
    expect(getCommunityIntro("es").statement).toMatch(/^es una comunidad/);
    expect(getCommunityIntro("es").supporting).toMatch(/^No solo importa/);
    expect(getCommunityIntro("en").statement).toMatch(/^is a community/);
    expect(getCommunityIntro("en").supporting).toMatch(/^How we feel today matters/);
  });

  it("has the same shape in both locales", () => {
    expect(shape(getCommunityIntro("en"))).toEqual(shape(getCommunityIntro("es")));
  });
});
