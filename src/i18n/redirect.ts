import { localePath, pickLocale, splitLocale } from "./config";

/**
 * Where an unprefixed request should be sent, or null when the path already
 * carries a locale. `search` is the raw query string including its leading "?".
 */
export function localeRedirect(pathname: string, search: string, acceptLanguage: string | null): string | null {
  if (splitLocale(pathname).lang) return null;
  // Collapse leading slashes/backslashes: "//host/x" must never become a protocol-relative redirect target.
  const safePath = `/${pathname.replace(/^[/\\]+/, "")}`;
  return `${localePath(pickLocale(acceptLanguage), safePath)}${search}`;
}
