import { describe, expect, it } from "vitest";
import { localeRedirect } from "./redirect";

describe("localeRedirect", () => {
  it("redirects an unprefixed path using the browser language", () => {
    expect(localeRedirect("/journey", "", "es-CO,es;q=0.9")).toBe("/es/journey");
    expect(localeRedirect("/journey", "", "en-US,en;q=0.9")).toBe("/en/journey");
  });

  it("redirects the root to the locale home", () => {
    expect(localeRedirect("/", "", "es")).toBe("/es");
    expect(localeRedirect("/", "", null)).toBe("/es");
  });

  it("falls back to the default locale without a usable header", () => {
    expect(localeRedirect("/speaking", "", null)).toBe("/es/speaking");
    expect(localeRedirect("/speaking", "", "fr-FR")).toBe("/es/speaking");
  });

  it("preserves the query string", () => {
    expect(localeRedirect("/essays", "?topic=ai", "es")).toBe("/es/essays?topic=ai");
    expect(localeRedirect("/", "?utm_source=x", "en")).toBe("/en?utm_source=x");
  });

  it("does nothing when the path already has a locale", () => {
    expect(localeRedirect("/en/journey", "", "es")).toBeNull();
    expect(localeRedirect("/es", "", "en")).toBeNull();
    expect(localeRedirect("/es/", "", "en")).toBeNull();
  });

  it("does not treat a similar-looking segment as a locale", () => {
    expect(localeRedirect("/english", "", "es")).toBe("/es/english");
  });

  it("never produces a protocol-relative target, whatever slashes the request carries", () => {
    for (const pathname of ["//evil.com/x", "///evil.com", "//", "/\\evil.com"]) {
      const target = localeRedirect(pathname, "", "es");
      expect(target, pathname).toMatch(/^\/(en|es)(\/|$)/);
      expect(target, pathname).not.toMatch(/^\/\//);
      expect(new URL(target!, "https://site.com").origin, pathname).toBe("https://site.com");
    }
  });
});
