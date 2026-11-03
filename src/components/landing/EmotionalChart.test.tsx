import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { chart } from "@/data/wellbeing";
import { EmotionalChart } from "./EmotionalChart";

let trigger: () => void;

beforeEach(() => {
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
afterEach(() => vi.unstubAllGlobals());

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
