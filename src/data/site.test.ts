import { describe, expect, it } from "vitest";
import { footer, headerCta, mobileMenu, navLinks, sectionIds, siteMetadata } from "./site";

const internalAnchors = () =>
  [
    ...navLinks,
    headerCta,
    ...footer.columns.flatMap((column) => column.links),
  ]
    .map((link) => link.href)
    .filter((href) => href.length > 1 && href.startsWith("#"));

describe("site data", () => {
  it("exposes Spanish metadata for the page", () => {
    expect(siteMetadata.title).toContain("NIDOU");
    expect(siteMetadata.description.length).toBeGreaterThan(40);
  });

  it("only links to anchors that exist as section ids", () => {
    const known = Object.values(sectionIds).map((id) => `#${id}`);
    for (const href of internalAnchors()) {
      expect(known).toContain(href);
    }
  });

  it("has unique section ids", () => {
    const ids = Object.values(sectionIds);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has Spanish labels for the mobile menu", () => {
    expect(mobileMenu.openLabel).toBe("Abrir menú");
    expect(mobileMenu.closeLabel).toBe("Cerrar menú");
    expect(mobileMenu.navLabel.length).toBeGreaterThan(3);
  });

  it("has a contact email", () => {
    expect(footer.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});
