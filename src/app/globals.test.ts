import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");
const token = (name: string) =>
  css.match(new RegExp(`${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1].toLowerCase();

describe("globals.css", () => {
  it("uses Tailwind 4 with the theme declared in CSS", () => {
    expect(css).toContain('@import "tailwindcss"');
    expect(css).toMatch(/@theme\s*\{/);
  });

  it("defines the NIDOU brand palette", () => {
    expect(token("--color-cream")).toBe("#f9f6f0");
    expect(token("--color-navy")).toBe("#2e363d");
    expect(token("--color-sage")).toBe("#8fa38b");
    expect(token("--color-terracotta")).toBe("#c36648");
  });

  it("maps semantic colors onto the palette", () => {
    expect(css).toMatch(/--color-background:\s*var\(--color-cream\)/);
    expect(css).toMatch(/--color-primary:\s*var\(--color-navy\)/);
    expect(css).toMatch(/--color-secondary:\s*var\(--color-sage\)/);
    expect(css).toMatch(/--color-accent:\s*var\(--color-terracotta\)/);
  });

  it("registers the heading and body fonts", () => {
    expect(css).toMatch(/--font-heading:\s*var\(--font-fraunces\)/);
    expect(css).toMatch(/--font-sans:\s*var\(--font-geist-sans\)/);
  });

  it("disables every decorative animation under prefers-reduced-motion", () => {
    const block = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    for (const selector of [".reveal", ".enso-stroke", ".enso-dot", ".chart-line", ".chart-fill", ".chart-dot"]) {
      expect(block, selector).toContain(selector);
    }
  });

  it("only smooth-scrolls when the user has no reduced-motion preference", () => {
    const block =
      css.match(/@media \(prefers-reduced-motion: no-preference\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(block).toMatch(/scroll-behavior:\s*smooth/);
    expect(css.replace(block, "")).not.toMatch(/scroll-behavior:\s*smooth/);
  });

  it("keeps every text pair at WCAG AA (>= 4.5:1)", () => {
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5]
        .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (a: string, b: string) => {
      const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
      return (x + 0.05) / (y + 0.05);
    };
    const cream = token("--color-cream")!;
    const card = token("--color-card")!;
    const muted = token("--color-muted")!;
    const sageText = token("--color-sage-text")!;
    const terracottaText = token("--color-terracotta-text")!;
    const mutedForeground = token("--color-muted-foreground")!;

    for (const bg of [cream, card, muted]) {
      expect(ratio(sageText, bg)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(terracottaText, bg)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(mutedForeground, bg)).toBeGreaterThanOrEqual(4.5);
    }
    expect(ratio(cream, terracottaText)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(token("--color-navy")!, token("--color-sage")!)).toBeGreaterThanOrEqual(4.5);
  });

  it("exposes text-safe semantic tokens", () => {
    expect(css).toMatch(/--color-secondary-text:\s*var\(--color-sage-text\)/);
    expect(css).toMatch(/--color-accent-text:\s*var\(--color-terracotta-text\)/);
  });

  it("has no dark-mode variant", () => {
    expect(css).not.toMatch(/dark/);
  });
});
