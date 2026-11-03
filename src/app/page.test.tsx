import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./page";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("Page", () => {
  it("renders the whole landing in one page with a single h1", () => {
    const { container } = render(<Page />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    for (const id of ["inicio", "como-funciona", "comunidad", "bienestar", "historias", "unete"]) {
      expect(container.querySelector(`#${id}`), id).not.toBeNull();
    }
  });
});
