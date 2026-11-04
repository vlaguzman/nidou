import { describe, expect, it } from "vitest";
import { alternatesFor, DEFAULT_LOCALE, hasLocale, LOCALES, localePath, pickLocale, splitLocale } from "./config";

describe("locales", () => {
  it("supports English and Spanish with Spanish as the default", () => {
    expect(LOCALES).toEqual(["en", "es"]);
    expect(DEFAULT_LOCALE).toBe("es");
  });

  it("recognises only supported locales", () => {
    expect(hasLocale("en")).toBe(true);
    expect(hasLocale("es")).toBe(true);
    expect(hasLocale("fr")).toBe(false);
    expect(hasLocale("EN")).toBe(false);
    expect(hasLocale("")).toBe(false);
  });
});

describe("localePath", () => {
  it("prefixes an internal route with the locale", () => {
    expect(localePath("en", "/journey")).toBe("/en/journey");
    expect(localePath("es", "/essays/some-slug")).toBe("/es/essays/some-slug");
  });

  it("maps the home route to the bare locale", () => {
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("es", "/")).toBe("/es");
  });

  it("keeps the hash of a route", () => {
    expect(localePath("en", "/journey#now")).toBe("/en/journey#now");
  });

  it("maps a home anchor to the locale home with the hash", () => {
    expect(localePath("en", "/#contact")).toBe("/en#contact");
    expect(localePath("es", "/#home")).toBe("/es#home");
  });

  it("keeps the query string of a route", () => {
    expect(localePath("es", "/essays?topic=ai")).toBe("/es/essays?topic=ai");
  });

  it("leaves in-page hashes untouched", () => {
    expect(localePath("en", "#contact")).toBe("#contact");
    expect(localePath("es", "#home")).toBe("#home");
  });

  it("leaves absolute and protocol URLs untouched", () => {
    expect(localePath("en", "https://gingga.com/")).toBe("https://gingga.com/");
    expect(localePath("es", "http://example.com/a")).toBe("http://example.com/a");
    expect(localePath("en", "mailto:me@example.com")).toBe("mailto:me@example.com");
    expect(localePath("en", "//cdn.example.com/x")).toBe("//cdn.example.com/x");
  });

  it("leaves an href that already carries a locale prefix untouched", () => {
    expect(localePath("es", "/en/journey")).toBe("/en/journey");
    expect(localePath("en", "/es")).toBe("/es");
    expect(localePath("en", "/es#contact")).toBe("/es#contact");
  });

  it("does not mistake a route that merely starts with locale letters for a prefix", () => {
    expect(localePath("en", "/essays")).toBe("/en/essays");
    expect(localePath("en", "/entry")).toBe("/en/entry");
  });
});

describe("splitLocale", () => {
  it("separates the locale from the path", () => {
    expect(splitLocale("/en/journey")).toEqual({ lang: "en", path: "/journey" });
    expect(splitLocale("/es/essays/some-slug")).toEqual({ lang: "es", path: "/essays/some-slug" });
  });

  it("returns the root path for a bare locale", () => {
    expect(splitLocale("/en")).toEqual({ lang: "en", path: "/" });
    expect(splitLocale("/es/")).toEqual({ lang: "es", path: "/" });
  });

  it("reports no locale when the pathname is not prefixed", () => {
    expect(splitLocale("/journey")).toEqual({ lang: null, path: "/journey" });
    expect(splitLocale("/")).toEqual({ lang: null, path: "/" });
    expect(splitLocale("/english")).toEqual({ lang: null, path: "/english" });
  });
});

describe("pickLocale", () => {
  it("falls back to the default when the header is missing or empty", () => {
    expect(pickLocale(null)).toBe("es");
    expect(pickLocale(undefined)).toBe("es");
    expect(pickLocale("")).toBe("es");
  });

  it("matches the primary subtag of a regional language", () => {
    expect(pickLocale("es-CO,es;q=0.9,en;q=0.8")).toBe("es");
    expect(pickLocale("en-GB")).toBe("en");
  });

  it("respects q-values regardless of order", () => {
    expect(pickLocale("en;q=0.4, es;q=0.9")).toBe("es");
    expect(pickLocale("es;q=0.2, en;q=0.8")).toBe("en");
  });

  it("compares the language case-insensitively", () => {
    expect(pickLocale("ES-co")).toBe("es");
  });

  it("skips unsupported languages and takes the best supported one", () => {
    expect(pickLocale("fr-FR,fr;q=0.9,es;q=0.5")).toBe("es");
  });

  it("falls back to the default when nothing is supported", () => {
    expect(pickLocale("fr-FR,de;q=0.8")).toBe("es");
    expect(pickLocale("*")).toBe("es");
  });

  it("ignores entries with q=0 and malformed q-values", () => {
    expect(pickLocale("es;q=0, en;q=0.1")).toBe("en");
    expect(pickLocale("en;q=abc")).toBe("es");
  });

  it("prefers the earlier entry on equal weight", () => {
    expect(pickLocale("es, en")).toBe("es");
    expect(pickLocale("en, es")).toBe("en");
  });

  it("ignores a language whose q-value is malformed instead of giving it full weight", () => {
    expect(pickLocale("es;q=abc,en;q=0.9")).toBe("en");
    expect(pickLocale("en;q=abc,es;q=0.9")).toBe("es");
  });
});

describe("alternatesFor", () => {
  it("builds canonical and hreflang links for a page", () => {
    expect(alternatesFor("es", "/journey")).toEqual({
      canonical: "/es/journey",
      languages: { en: "/en/journey", es: "/es/journey", "x-default": "/es/journey" },
    });
  });

  it("handles the home page", () => {
    expect(alternatesFor("en", "/")).toEqual({
      canonical: "/en",
      languages: { en: "/en", es: "/es", "x-default": "/es" },
    });
  });
});
