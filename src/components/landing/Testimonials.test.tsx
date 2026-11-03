import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testimonials } from "@/data/testimonials";
import { Testimonials } from "./Testimonials";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("Testimonials", () => {
  it("renders every testimonial as an article", () => {
    const { container } = render(<Testimonials />);
    expect(screen.getAllByRole("article")).toHaveLength(testimonials.items.length);
    for (const item of testimonials.items) {
      expect(screen.getByText(item.quote)).toBeInTheDocument();
      expect(screen.getByText(item.detail)).toBeInTheDocument();
    }
    expect(container.querySelector("section#historias")).not.toBeNull();
  });
});
