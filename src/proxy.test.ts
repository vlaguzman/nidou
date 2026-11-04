import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { config, proxy } from "./proxy";

function request(path: string, acceptLanguage?: string) {
  return new NextRequest(`http://localhost:3001${path}`, {
    headers: acceptLanguage ? { "accept-language": acceptLanguage } : {},
  });
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
