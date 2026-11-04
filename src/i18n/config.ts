import type { Metadata } from "next";

export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Prefixes an internal href with the locale. In-page hashes, absolute URLs and
 * hrefs that already carry a locale are returned unchanged.
 */
export function localePath(lang: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//") || SCHEME.test(href)) return href;

  const [first = ""] = href.slice(1).split(/[/?#]/, 1);
  if (hasLocale(first)) return href;

  // "/", "/#contact" and "/?x" map to the locale home, not "/en/".
  const isHome = href === "/" || href.startsWith("/#") || href.startsWith("/?");
  return `/${lang}${isHome ? href.slice(1) : href}`;
}

/** Splits a pathname into its locale (or null) and the locale-free path. */
export function splitLocale(pathname: string): { lang: Locale | null; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if (!hasLocale(first)) return { lang: null, path: pathname };
  return { lang: first, path: `/${rest.join("/")}` };
}

/** Picks the best supported locale from an Accept-Language header. */
export function pickLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const candidates = acceptLanguage
    .split(",")
    .map((entry, index) => {
      const [tag = "", ...params] = entry.trim().split(";");
      const qParam = params.map((p) => p.trim()).find((p) => p.toLowerCase().startsWith("q="));
      const parsed = qParam ? Number(qParam.slice(2)) : 1;
      return {
        language: tag.trim().split("-")[0]?.toLowerCase() ?? "",
        q: Number.isNaN(parsed) ? 0 : parsed, // a malformed weight disqualifies the entry
        index,
      };
    })
    .filter((c) => c.q > 0 && hasLocale(c.language))
    .sort((a, b) => b.q - a.q || a.index - b.index);

  const best = candidates[0]?.language;
  return best && hasLocale(best) ? best : DEFAULT_LOCALE;
}

/** Canonical and hreflang alternates for a locale-free page path. */
export function alternatesFor(lang: Locale, path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localePath(lang, path),
    languages: {
      en: localePath("en", path),
      es: localePath("es", path),
      "x-default": localePath(DEFAULT_LOCALE, path),
    },
  };
}
