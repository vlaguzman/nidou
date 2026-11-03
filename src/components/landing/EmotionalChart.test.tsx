import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { chart } from "@/data/wellbeing";
import { EmotionalChart } from "./EmotionalChart";

let trigger: () => void;

const stubTop = (top: number) =>
  vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockReturnValue({ top, bottom: top + 100, height: 100 } as DOMRect);

beforeEach(() => {
  stubTop(5000); // below the fold by default (jsdom would report zeros)
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (entries: { isIntersecting: boolean }[]) => void) {
        trigger = () => cb([{ isIntersecting: true }]);
      }
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("EmotionalChart", () => {
  it("describes the chart for assistive tech", () => {
    render(<EmotionalChart />);
    expect(screen.getByRole("img", { name: chart.ariaLabel })).toBeInTheDocument();
    expect(screen.getByText(chart.title)).toBeInTheDocument();
    expect(screen.getByText(chart.range)).toBeInTheDocument();
    expect(screen.getByText("Sem 10")).toBeInTheDocument();
  });

  it("draws the line once it scrolls into view", () => {
    const { container } = render(<EmotionalChart />);
    const line = container.querySelector("path[stroke]") as SVGPathElement;
    expect(line.style.strokeDashoffset).toBe("1");
    trigger();
    return vi.waitFor(() => expect(line.style.strokeDashoffset).toBe("0"));
  });

  it("does not arm a chart already in the viewport on mount (no un-draw/redraw flash)", () => {
    stubTop(100);
    const { container } = render(<EmotionalChart />);
    const line = container.querySelector("path[stroke]") as SVGPathElement;
    expect(line.style.strokeDashoffset).toBe("0");
  });

  it("still arms a chart below the fold", () => {
    stubTop(window.innerHeight + 200);
    const { container } = render(<EmotionalChart />);
    const line = container.querySelector("path[stroke]") as SVGPathElement;
    expect(line.style.strokeDashoffset).toBe("1");
  });

  it("renders the finished chart on the server so it is not blank without JS", () => {
    const html = renderToString(<EmotionalChart />);
    expect(html).toMatch(/stroke-dashoffset:\s*0/);
    expect(html).not.toMatch(/stroke-dashoffset:\s*1(?!\d)/);
    expect(html).not.toMatch(/\sopacity="0"/);
  });

  it("uses a normalised path length so the dash maths is independent of geometry", () => {
    const { container } = render(<EmotionalChart />);
    const line = container.querySelector("path[stroke]") as SVGPathElement;
    expect(line).toHaveAttribute("pathLength", "1");
  });

  it("shows the finished chart immediately without IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(<EmotionalChart />);
    const line = container.querySelector("path[stroke]") as SVGPathElement;
    expect(line.style.strokeDashoffset).toBe("0");
  });

  it("shows the finished chart immediately under prefers-reduced-motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));
    const { container } = render(<EmotionalChart />);
    const line = container.querySelector("path[stroke]") as SVGPathElement;
    expect(line.style.strokeDashoffset).toBe("0");
  });
});
