import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, localeFromPath, localeRedirect } from "@/i18n/redirect";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  const target = localeRedirect(pathname, search, request.headers.get("accept-language"), remembered);
  if (target) return NextResponse.redirect(new URL(target, request.url), 307);

  // The path carries a locale: remember it (only when it changed) so the next unprefixed visit lands in the same language.
  const response = NextResponse.next();
  const lang = localeFromPath(pathname);
  if (lang && lang !== remembered) {
    response.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
  }
  return response;
}

export const config = {
  // Skip Next internals, API routes and anything with a file extension (images, PDFs, favicon, robots...).
  matcher: ["/((?!_next|api/|api$|.*\\..*).*)"],
};
