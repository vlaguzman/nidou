import { hasLocale, localePath, pickLocale, splitLocale, type Locale } from "./config";

export const LOCALE_COOKIE = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** The locale a pathname already carries, or null. */
export function localeFromPath(pathname: string): Locale | null {
  return splitLocale(pathname).lang;
}

/**
 * Where an unprefixed request should be sent, or null when the path already
 * carries a locale. `search` is the raw query string including its leading "?".
 * A valid remembered locale (cookie) wins over Accept-Language; anything else is ignored.
 */
export function localeRedirect(
  pathname: string,
  search: string,
  acceptLanguage: string | null,
  remembered?: string | null,
): string | null {
  if (localeFromPath(pathname)) return null;
  // Collapse leading slashes/backslashes: "//host/x" must never become a protocol-relative redirect target.
  const safePath = `/${pathname.replace(/^[/\\]+/, "")}`;
  const lang = remembered && hasLocale(remembered) ? remembered : pickLocale(acceptLanguage);
  return `${localePath(lang, safePath)}${search}`;
}
