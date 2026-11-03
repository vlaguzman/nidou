import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { moodScale, moodTimeline } from "@/data/emotionalHistory";
import { EmotionalHistory } from "./EmotionalHistory";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("EmotionalHistory", () => {
  it("renders the copy and the quote", () => {
    render(<EmotionalHistory />);
    expect(screen.getByRole("heading", { name: "Tu historia emocional" })).toBeInTheDocument();
    expect(screen.getByText(/darte cuenta cómo estás/)).toBeInTheDocument();
  });

  it("renders one badge per logged day with an accessible mood name", () => {
    render(<EmotionalHistory />);
    for (const entry of moodTimeline) {
      expect(screen.getAllByText(entry.date).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText("Lluvioso", { selector: ".sr-only" })).toHaveLength(2);
  });

  it("renders a legend entry for every mood in the scale", () => {
    render(<EmotionalHistory />);
    for (const { mood } of moodScale) {
      expect(screen.getAllByText(mood).length).toBeGreaterThan(0);
    }
  });

  it("places sunnier days higher than stormy ones", () => {
    render(<EmotionalHistory />);
    const top = (date: string) =>
      parseFloat((screen.getByText(date).parentElement as HTMLElement).style.top);
    expect(top("30 May")).toBeLessThan(top("2 May"));
  });

  it("scales badges down on small screens and centres them on the polyline", () => {
    const { container } = render(<EmotionalHistory />);
    const badge = screen.getAllByText("2 May")[0].previousElementSibling as HTMLElement;
    expect(badge).toHaveClass("h-9", "w-9", "sm:h-14", "sm:w-14");
    const wrapper = badge.parentElement as HTMLElement;
    expect(wrapper).toHaveClass("-translate-y-4.5", "sm:-translate-y-7");
    // Badge centre (wrapper top) must match the polyline vertex for the same point.
    const [, firstY] = container.querySelector("polyline")!.getAttribute("points")!.split(" ")[0].split(",");
    expect(parseFloat(wrapper.style.top)).toBeCloseTo(parseFloat(firstY), 1);
  });
});
