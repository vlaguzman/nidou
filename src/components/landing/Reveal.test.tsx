import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";

let trigger: (isIntersecting: boolean) => void;
const disconnect = vi.fn();

beforeEach(() => {
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

afterEach(() => vi.unstubAllGlobals());

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
