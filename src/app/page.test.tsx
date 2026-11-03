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

  it("renders sections in the expected order", () => {
    const { container } = render(<Page />);
    const order = ["inicio", "historias", "bienestar", "como-funciona", "comunidad", "unete"];
    const positions = order.map((id) => {
      const el = container.querySelector(`#${id}`)!;
      return Array.from(container.querySelectorAll("section")).indexOf(el as HTMLElement);
    });
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    // CommunityIntro sits right after the hero and before testimonials.
    const sections = Array.from(container.querySelectorAll("main > section"));
    expect(sections[0].id).toBe("inicio");
    expect(sections[1]).toHaveTextContent("es una comunidad donde nos encontramos");
    expect(sections[2].id).toBe("historias");
    expect(sections.at(-1)!.id).toBe("unete");
  });
});
