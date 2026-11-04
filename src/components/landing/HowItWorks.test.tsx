import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HowItWorks } from "./HowItWorks";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("HowItWorks", () => {
  it("renders five numbered steps", () => {
    const { container } = render(<HowItWorks lang="es" />);
    expect(screen.getByRole("heading", { name: "Así funciona" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("Comparte cómo te sientes.")).toBeInTheDocument();
    expect(container.querySelector("section#como-funciona")).not.toBeNull();
  });
});

describe("HowItWorks in English", () => {
  it("renders the English steps", () => {
    const { container } = render(<HowItWorks lang="en" />);
    expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("Share how you're feeling.")).toBeInTheDocument();
    expect(container.querySelector("section#como-funciona")).not.toBeNull();
  });
});
