import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ValuesSection } from "./ValuesSection";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("ValuesSection", () => {
  it("renders the heading and the three values", () => {
    render(<ValuesSection lang="es" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/cuidar de ti/);
    for (const title of ["Escucharte", "Conectar", "Crecer"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });
});

describe("ValuesSection in English", () => {
  it("renders the English heading and values", () => {
    render(<ValuesSection lang="en" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/looking after yourself/);
    for (const title of ["Listen to yourself", "Connect", "Grow"]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }
  });
});
