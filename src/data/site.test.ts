import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getSite, INSTAGRAM_HREF, sectionIds, SITE_URL } from "./site";

const LOCALES = ["es", "en"] as const;

const internalAnchors = (lang: (typeof LOCALES)[number]) => {
  const { navLinks, headerCta, footer } = getSite(lang);
  return [...navLinks, headerCta, ...footer.columns.flatMap((column) => column.links)]
    .map((link) => link.href)
    .filter((href) => href.length > 1 && href.startsWith("#"));
};

describe("site data", () => {
  it("uses the production origin, without a path or trailing slash, as the site URL", () => {
    expect(SITE_URL).toBe("https://nidou.co.uk");
    expect(new URL(SITE_URL).pathname).toBe("/");
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("exposes metadata for the page in each locale", () => {
    for (const lang of LOCALES) {
      const { metadata } = getSite(lang);
      expect(metadata.title).toContain("NIDOU");
      expect(metadata.description.length).toBeGreaterThan(40);
    }
    expect(getSite("es").metadata.description).toMatch(/^NIDOU es un espacio/);
    expect(getSite("en").metadata.description).toMatch(/^NIDOU is a space/);
  });

  it("only links to anchors that exist as section ids", () => {
    const known = Object.values(sectionIds).map((id) => `#${id}`);
    for (const lang of LOCALES) {
      for (const href of internalAnchors(lang)) expect(known).toContain(href);
    }
  });

  it("keeps the Spanish anchor ids for both locales", () => {
    expect(sectionIds.comoFunciona).toBe("como-funciona");
    expect(getSite("en").navLinks[0].href).toBe("#como-funciona");
  });

  it("has unique section ids", () => {
    const ids = Object.values(sectionIds);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has labels for the mobile menu", () => {
    expect(getSite("es").mobileMenu.openLabel).toBe("Abrir menú");
    expect(getSite("es").mobileMenu.closeLabel).toBe("Cerrar menú");
    expect(getSite("en").mobileMenu.openLabel).toBe("Open menu");
    expect(getSite("en").mobileMenu.closeLabel).toBe("Close menu");
    for (const lang of LOCALES) expect(getSite(lang).mobileMenu.navLabel.length).toBeGreaterThan(3);
  });

  it("labels the language switcher in the page language", () => {
    expect(getSite("es").languageLabel).toBe("Idioma");
    expect(getSite("en").languageLabel).toBe("Language");
  });

  it("has a contact email shared by both locales", () => {
    for (const lang of LOCALES) {
      expect(getSite(lang).footer.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    }
    expect(getSite("en").footer.email).toBe(getSite("es").footer.email);
  });

  it("points to the real Instagram profile from both locales", () => {
    expect(INSTAGRAM_HREF).toBe("https://www.instagram.com/nidou.family");
    for (const lang of LOCALES) expect(getSite(lang).footer.instagramHref).toBe(INSTAGRAM_HREF);
  });

  it("has the same shape in both locales", () => {
    expect(shape(getSite("en"))).toEqual(shape(getSite("es")));
  });
});
