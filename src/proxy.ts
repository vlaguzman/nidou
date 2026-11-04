import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeRedirect } from "@/i18n/redirect";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const target = localeRedirect(pathname, search, request.headers.get("accept-language"));
  if (!target) return NextResponse.next();
  return NextResponse.redirect(new URL(target, request.url), 307);
}

export const config = {
  // Skip Next internals, API routes and anything with a file extension (images, PDFs, favicon, robots...).
  matcher: ["/((?!_next|api/|api$|.*\\..*).*)"],
};
