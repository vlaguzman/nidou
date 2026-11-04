import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "./proxy";

function request(path: string, acceptLanguage?: string, cookie?: string) {
  const headers: Record<string, string> = {};
  if (acceptLanguage) headers["accept-language"] = acceptLanguage;
  if (cookie) headers.cookie = cookie;
  return new NextRequest(`http://localhost:3001${path}`, { headers });
}

describe("proxy", () => {
  it("redirects an unprefixed path with a temporary redirect, keeping the query", () => {
    const response = proxy(request("/comunidad?topic=ai", "es-CO,es;q=0.9"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3001/es/comunidad?topic=ai");
  });

  it("falls back to Spanish without a language header", () => {
    const response = proxy(request("/"));
    expect(response.headers.get("location")).toBe("http://localhost:3001/es");
  });

  it("lets a prefixed path through", () => {
    const response = proxy(request("/en/journey", "es"));
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});

describe("proxy locale cookie", () => {
  it("remembers the locale of a prefixed request for a year", () => {
    const cookie = proxy(request("/en", "es")).cookies.get("NEXT_LOCALE");
    expect(cookie).toMatchObject({ value: "en", path: "/", maxAge: 31536000, sameSite: "lax" });
  });

  it("updates the cookie when the reader switches language", () => {
    const response = proxy(request("/es/journey", "en", "NEXT_LOCALE=en"));
    expect(response.cookies.get("NEXT_LOCALE")?.value).toBe("es");
  });

  it("does not resend the cookie when it already holds the same language", () => {
    expect(proxy(request("/es", "en", "NEXT_LOCALE=es")).cookies.get("NEXT_LOCALE")).toBeUndefined();
  });

  it("sends a returning reader to the remembered language, not the browser's", () => {
    const response = proxy(request("/", "en-US,en;q=0.9", "NEXT_LOCALE=es"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3001/es");
  });

  it("ignores an invalid cookie and falls back to Accept-Language", () => {
    const response = proxy(request("/", "en", "NEXT_LOCALE=fr"));
    expect(response.headers.get("location")).toBe("http://localhost:3001/en");
  });

  it("does not set a cookie on the redirect itself (only a confirmed choice is remembered)", () => {
    expect(proxy(request("/", "en")).cookies.get("NEXT_LOCALE")).toBeUndefined();
  });
});

describe("proxy matcher", () => {
  const [source] = config.matcher;
  // Next anchors the pattern after the leading slash; emulate that for the capture group.
  const body = source!.replace(/^\//, "");
  const matches = (path: string) => new RegExp(`^/${body}$`).test(path);

  it("runs for pages", () => {
    expect(matches("/")).toBe(true);
    expect(matches("/journey")).toBe(true);
    expect(matches("/essays/some-slug")).toBe(true);
    expect(matches("/en/journey")).toBe(true);
  });

  it("skips Next internals and API routes", () => {
    expect(matches("/_next/static/chunk.js")).toBe(false);
    expect(matches("/api/subscribe")).toBe(false);
    expect(matches("/api")).toBe(false);
  });

  it("skips public files with an extension", () => {
    expect(matches("/images/hero.jpg")).toBe(false);
    expect(matches("/docs/founder-profile.pdf")).toBe(false);
    expect(matches("/favicon.ico")).toBe(false);
    expect(matches("/robots.txt")).toBe(false);
  });
});
