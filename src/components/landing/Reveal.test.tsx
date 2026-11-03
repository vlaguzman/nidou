import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";

let trigger: (isIntersecting: boolean) => void;
const disconnect = vi.fn();

const stubTop = (top: number) =>
  vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue({ top, bottom: top + 100, height: 100 } as DOMRect);

beforeEach(() => {
  stubTop(5000); // below the fold by default (jsdom would report zeros)
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        trigger = (isIntersecting) => cb([{ isIntersecting }]);
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Reveal", () => {
  it("starts hidden and becomes visible once intersecting", () => {
    render(<Reveal>hola</Reveal>);
    const el = screen.getByText("hola");
    expect(el).toHaveClass("reveal");
    expect(el).not.toHaveClass("is-visible");
    act(() => trigger(false));
    expect(el).not.toHaveClass("is-visible");
    act(() => trigger(true));
    expect(el).toHaveClass("is-visible");
    expect(disconnect).toHaveBeenCalled();
  });

  it("does not arm elements already in the viewport on mount (no hide-then-show flash)", () => {
    stubTop(100);
    render(<Reveal>arriba</Reveal>);
    expect(screen.getByText("arriba")).not.toHaveClass("reveal");
  });

  it("still arms elements below the fold", () => {
    stubTop(window.innerHeight + 200);
    render(<Reveal>abajo</Reveal>);
    expect(screen.getByText("abajo")).toHaveClass("reveal");
  });

  it("uses a 0.92 viewport-height threshold (just below arms, just above does not)", () => {
    const edge = window.innerHeight * 0.92;
    stubTop(edge - 1);
    render(<Reveal>dentro</Reveal>);
    expect(screen.getByText("dentro")).not.toHaveClass("reveal");
    stubTop(edge);
    render(<Reveal>borde</Reveal>);
    expect(screen.getByText("borde")).toHaveClass("reveal");
  });

  it("applies delay and custom class and tag", () => {
    render(
      <Reveal as="article" delay={200} className="extra">
        x
      </Reveal>,
    );
    const el = screen.getByText("x");
    expect(el.tagName).toBe("ARTICLE");
    expect(el).toHaveClass("extra");
    expect(el.style.transitionDelay).toBe("200ms");
  });

  it("sets no inline style without a delay", () => {
    render(<Reveal>y</Reveal>);
    expect(screen.getByText("y")).not.toHaveAttribute("style");
  });

  it("renders visible (not armed) on the server so content shows without JS", () => {
    const html = renderToString(<Reveal>ssr</Reveal>);
    expect(html).not.toContain("reveal");
  });

  it("stays visible and never hides when IntersectionObserver is missing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal>sin io</Reveal>);
    const el = screen.getByText("sin io");
    expect(el).not.toHaveClass("reveal");
  });
});
