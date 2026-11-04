import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTestimonials } from "@/data/testimonials";
import { Testimonials } from "./Testimonials";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
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
    expect(screen.getAllByRole("button")).toHaveLength(1);
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
