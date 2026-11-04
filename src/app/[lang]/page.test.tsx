import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./page";

const params = (lang: string) => ({ params: Promise.resolve({ lang }) });

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("Page", () => {
  it("renders the whole landing in one page with a single h1", async () => {
    const { container } = render(await Page(params("es")));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    for (const id of ["inicio", "como-funciona", "comunidad", "bienestar", "historias", "unete"]) {
      expect(container.querySelector(`#${id}`), id).not.toBeNull();
    }
  });

  it("renders sections in the expected order", async () => {
    const { container } = render(await Page(params("es")));
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

  it("renders the English landing with the same sections", async () => {
    const { container } = render(await Page(params("en")));
    const sections = Array.from(container.querySelectorAll("main > section"));
    expect(sections[0].id).toBe("inicio");
    expect(sections[1]).toHaveTextContent("is a community where we meet");
    expect(sections[2].id).toBe("historias");
    expect(sections.at(-1)!.id).toBe("unete");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Motherhood transforms us.");
  });

  it("links the switcher to both locales", async () => {
    render(await Page(params("en")));
    const nav = screen.getByRole("navigation", { name: "Language" });
    expect(nav.querySelector('a[href="/en"]')).not.toBeNull();
    expect(nav.querySelector('a[href="/es"]')).not.toBeNull();
  });

  it("answers 404 for an unsupported locale", async () => {
    await expect(Page(params("fr"))).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/);
  });
});
