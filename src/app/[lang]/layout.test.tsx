import { describe, expect, it, vi } from "vitest";

// next/font/google is resolved by the Next compiler; stub it for tests.
vi.mock("next/font/google", () => {
  const font = () => ({ variable: "font-var", className: "font-class" });
  return { Geist: font, Fraunces: font };
});

import RootLayout, * as layoutModule from "./layout";

const params = (lang: string) => ({ params: Promise.resolve({ lang }) });

describe("locale static params", () => {
  it("pre-renders the layout for every locale and 404s the rest", () => {
    expect(layoutModule.generateStaticParams()).toEqual([{ lang: "en" }, { lang: "es" }]);
    expect(layoutModule.dynamicParams).toBe(false);
  });
});

describe("root layout", () => {
  it("sets the document language from the route", async () => {
    for (const lang of ["es", "en"]) {
      const tree = await RootLayout({ children: null, ...params(lang) });
      expect(tree.type).toBe("html");
      expect(tree.props.lang).toBe(lang);
    }
  });

  it("answers 404 for an unsupported locale", async () => {
    await expect(RootLayout({ children: null, ...params("fr") })).rejects.toThrow();
  });
});

describe("layout metadata", () => {
  it("uses the site title and description of the route locale", async () => {
    expect(await layoutModule.generateMetadata(params("es"))).toMatchObject({
      title: "NIDOU — Maternidad vivida en comunidad",
      description: expect.stringMatching(/^NIDOU es un espacio/),
    });
    expect(await layoutModule.generateMetadata(params("en"))).toMatchObject({
      title: "NIDOU — Motherhood, lived together",
      description: expect.stringMatching(/^NIDOU is a space/),
    });
  });

  it("resolves URLs against the production domain", async () => {
    const metadata = await layoutModule.generateMetadata(params("es"));
    expect(String(metadata.metadataBase)).toBe("https://nidou.co.uk/");
  });

  it("declares the canonical URL and hreflang alternates for each locale", async () => {
    expect((await layoutModule.generateMetadata(params("es"))).alternates).toEqual({
      canonical: "/es",
      languages: { en: "/en", es: "/es", "x-default": "/es" },
    });
    expect((await layoutModule.generateMetadata(params("en"))).alternates).toEqual({
      canonical: "/en",
      languages: { en: "/en", es: "/es", "x-default": "/es" },
    });
  });

  it("returns no metadata for an unsupported locale", async () => {
    expect(await layoutModule.generateMetadata(params("fr"))).toEqual({});
  });

  it("keeps the viewport and theme colour", () => {
    expect(layoutModule.viewport).toMatchObject({ colorScheme: "light", themeColor: "#f9f6f0" });
  });
});
