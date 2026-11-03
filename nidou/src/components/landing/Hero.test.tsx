import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

describe("Hero", () => {
  it("renders the headline", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("La maternidad cambia todo.");
    expect(h1).toHaveTextContent("Y es mejor vivirla acompañada.");
  });

  it("renders both CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Únete a la comunidad" })).toHaveAttribute("href", "#unete");
    expect(screen.getByRole("link", { name: "Descubre cómo funciona" })).toHaveAttribute("href", "#como-funciona");
  });

  it("does not hide above-the-fold content behind the scroll reveal", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector(".reveal")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 }).closest("[class*='reveal']")).toBeNull();
  });

  it("uses the text-safe sage token for the accent headline", () => {
    render(<Hero />);
    expect(screen.getByText("Y es mejor vivirla acompañada.")).toHaveClass("text-secondary-text");
  });

  it("shows the hero photo and the feeling card", () => {
    render(<Hero />);
    expect(screen.getByAltText(/Madres compartiendo un momento tranquilo/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "¿Cómo te sientes hoy?" })).toBeInTheDocument();
  });
});
