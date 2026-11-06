import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTestimonials } from "@/data/testimonials";
import { Testimonials } from "./Testimonials";

const scrollTo = vi.fn();

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
  scrollTo.mockReset();
  Element.prototype.scrollTo = scrollTo as unknown as Element["scrollTo"];
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const testimonials = getTestimonials("es");

describe("Testimonials", () => {
  it("renders every testimonial as an article", () => {
    const { container } = render(<Testimonials lang="es" />);
    expect(screen.getAllByRole("article")).toHaveLength(testimonials.items.length);
    for (const item of testimonials.items) {
      expect(screen.getByText(item.quote)).toBeInTheDocument();
      expect(screen.getAllByText(item.detail).length).toBeGreaterThan(0);
    }
    expect(container.querySelector("section#historias")).not.toBeNull();
  });

  it("offers a toggle only for the collapsible testimonial", () => {
    render(<Testimonials lang="es" />);
    expect(screen.getAllByRole("button", { name: /Leer/ })).toHaveLength(1);
    const toggle = screen.getByRole("button", { name: testimonials.expand.more });
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", screen.getByText(testimonials.items[0].quote).id);
  });

  it("clamps the collapsible quote and toggles it", () => {
    render(<Testimonials lang="es" />);
    const quote = screen.getByText(testimonials.items[0].quote);
    expect(quote).toHaveClass("line-clamp-5");
    fireEvent.click(screen.getByRole("button", { name: testimonials.expand.more }));
    const toggle = screen.getByRole("button", { name: testimonials.expand.less });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(quote).not.toHaveClass("line-clamp-5");
    fireEvent.click(toggle);
    expect(quote).toHaveClass("line-clamp-5");
    expect(screen.getByRole("button", { name: testimonials.expand.more })).toHaveAttribute("aria-expanded", "false");
  });

  it("never clamps non-collapsible quotes", () => {
    render(<Testimonials lang="es" />);
    expect(screen.getByText(testimonials.items[1].quote)).not.toHaveClass("line-clamp-5");
    expect(screen.getByText(testimonials.items[2].quote)).not.toHaveClass("line-clamp-5");
  });
});

describe("Testimonials carousel", () => {
  const { carousel } = testimonials;

  function track() {
    return screen.getByRole("region", { name: carousel.label }).querySelector(".testimonial-track") as HTMLElement;
  }

  function setScroll(el: HTMLElement, left: number) {
    Object.defineProperty(el, "scrollWidth", { configurable: true, value: 1000 });
    Object.defineProperty(el, "clientWidth", { configurable: true, value: 300 });
    Object.defineProperty(el, "scrollLeft", { configurable: true, value: left });
  }

  it("is a labelled carousel region with previous, pause and next controls", () => {
    render(<Testimonials lang="es" />);
    const region = screen.getByRole("region", { name: carousel.label });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("button", { name: carousel.previous })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: carousel.next })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: carousel.pause })).toBeInTheDocument();
  });

  it("wraps to the start after the last card and to the end before the first", () => {
    render(<Testimonials lang="es" />);
    setScroll(track(), 700);
    fireEvent.click(screen.getByRole("button", { name: carousel.next }));
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: 0 }));
    setScroll(track(), 0);
    fireEvent.click(screen.getByRole("button", { name: carousel.previous }));
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: 700 }));
  });

  it("advances on its own every few seconds", () => {
    vi.useFakeTimers();
    render(<Testimonials lang="es" />);
    act(() => vi.advanceTimersByTime(6000));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("stops advancing when paused and resumes on play", () => {
    vi.useFakeTimers();
    render(<Testimonials lang="es" />);
    fireEvent.click(screen.getByRole("button", { name: carousel.pause }));
    act(() => vi.advanceTimersByTime(12000));
    expect(scrollTo).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: carousel.play }));
    act(() => vi.advanceTimersByTime(6000));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("holds still while hovered", () => {
    vi.useFakeTimers();
    render(<Testimonials lang="es" />);
    const region = screen.getByRole("region", { name: carousel.label });
    fireEvent.pointerEnter(region, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(12000));
    expect(scrollTo).not.toHaveBeenCalled();
    fireEvent.pointerLeave(region, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(6000));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("keeps advancing after a touch, which fires no matching leave", () => {
    vi.useFakeTimers();
    render(<Testimonials lang="es" />);
    fireEvent.pointerEnter(screen.getByRole("region", { name: carousel.label }), { pointerType: "touch" });
    act(() => vi.advanceTimersByTime(6000));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it("stays held while focus is inside, even after the mouse leaves", () => {
    vi.useFakeTimers();
    render(<Testimonials lang="es" />);
    const region = screen.getByRole("region", { name: carousel.label });
    fireEvent.focus(screen.getByRole("button", { name: carousel.next }));
    fireEvent.pointerEnter(region, { pointerType: "mouse" });
    fireEvent.pointerLeave(region, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(12000));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("starts paused when the reader prefers reduced motion", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce") }));
    render(<Testimonials lang="es" />);
    expect(screen.getByRole("button", { name: carousel.play })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(12000));
    expect(scrollTo).not.toHaveBeenCalled();
  });
});

describe("Testimonials in English", () => {
  it("renders the English quotes and expand label", () => {
    const en = getTestimonials("en");
    const { container } = render(<Testimonials lang="en" />);
    expect(screen.getByRole("heading", { name: en.heading })).toBeInTheDocument();
    for (const item of en.items) expect(screen.getByText(item.quote)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Read more" }));
    expect(screen.getByRole("button", { name: "Read less" })).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector("section#historias")).not.toBeNull();
  });
});
