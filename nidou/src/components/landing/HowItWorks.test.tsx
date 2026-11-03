import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HowItWorks } from "./HowItWorks";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("HowItWorks", () => {
  it("renders five numbered steps", () => {
    const { container } = render(<HowItWorks />);
    expect(screen.getByRole("heading", { name: "Así funciona" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
    expect(screen.getByText("Comparte cómo te sientes.")).toBeInTheDocument();
    expect(container.querySelector("section#como-funciona")).not.toBeNull();
  });
});
