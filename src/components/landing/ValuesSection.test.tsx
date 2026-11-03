import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ValuesSection } from "./ValuesSection";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("ValuesSection", () => {
  it("renders the heading and the three values", () => {
    render(<ValuesSection />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/cuidar de ti/);
    for (const title of ["Escucharte", "Conectar", "Crecer"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });
});
