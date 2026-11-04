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
    render(<Hero lang="es" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("La maternidad nos transforma.");
    expect(h1).toHaveTextContent("La comunidad nos sostiene.");
  });

  it("does not render the removed eyebrow or description", () => {
    render(<Hero lang="es" />);
    expect(screen.queryByText("Maternidad vivida en comunidad")).toBeNull();
    expect(screen.queryByText(/NIDOU es un espacio/)).toBeNull();
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveClass("mt-6");
  });

  it("renders both CTAs", () => {
    render(<Hero lang="es" />);
    expect(screen.getByRole("link", { name: "Únete a la comunidad" })).toHaveAttribute("href", "#unete");
    expect(screen.getByRole("link", { name: "Descubre Nidou." })).toHaveAttribute("href", "#como-funciona");
  });

  it("does not hide above-the-fold content behind the scroll reveal", () => {
    const { container } = render(<Hero lang="es" />);
    expect(container.querySelector(".reveal")).toBeNull();
    expect(screen.getByRole("heading", { level: 1 }).closest("[class*='reveal']")).toBeNull();
  });

  it("uses the text-safe sage token for the accent headline", () => {
    render(<Hero lang="es" />);
    expect(screen.getByText("La comunidad nos sostiene.")).toHaveClass("text-secondary-text");
  });

  it("shows the hero photo and the feeling card", () => {
    render(<Hero lang="es" />);
    expect(screen.getByAltText(/Madres compartiendo un momento tranquilo/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "¿Cómo te sientes hoy?" })).toBeInTheDocument();
  });
});

describe("Hero in English", () => {
  it("renders the English headline, CTAs and feeling card", () => {
    render(<Hero lang="en" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Motherhood transforms us.");
    expect(h1).toHaveTextContent("Community holds us.");
    expect(screen.getByRole("link", { name: "Join the community" })).toHaveAttribute("href", "#unete");
    expect(screen.getByRole("link", { name: "Discover Nidou." })).toHaveAttribute("href", "#como-funciona");
    expect(screen.getByRole("heading", { name: "How are you feeling today?" })).toBeInTheDocument();
  });
});
