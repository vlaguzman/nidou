import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSite } from "@/data/site";
import { SiteHeader } from "./SiteHeader";

const { mobileMenu, navLinks } = getSite("es");

describe("SiteHeader", () => {
  it("links home through the logo", () => {
    render(<SiteHeader lang="es" />);
    expect(screen.getByRole("link", { name: "NIDOU, inicio" })).toHaveAttribute("href", "#inicio");
  });

  it("renders the webp logo with dimensions matching its aspect ratio", () => {
    render(<SiteHeader lang="es" />);
    const logo = screen.getByAltText("NIDOU");
    expect(decodeURIComponent(logo.getAttribute("src") ?? "")).toContain("nidou-logo.webp");
    expect(Number(logo.getAttribute("width")) / Number(logo.getAttribute("height"))).toBeCloseTo(480 / 145, 1);
  });

  it("renders every nav link and the join CTA", () => {
    render(<SiteHeader lang="es" />);
    const nav = screen.getByRole("navigation", { name: "Principal" });
    for (const link of navLinks) {
      expect(nav).toContainElement(screen.getByRole("link", { name: link.label }));
    }
    expect(screen.getByRole("link", { name: "Únete" })).toHaveAttribute("href", "#unete");
  });

  it("gains a background once the page is scrolled", () => {
    render(<SiteHeader lang="es" />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("border-transparent");
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, configurable: true });
      fireEvent.scroll(window);
    });
    expect(header).toHaveClass("backdrop-blur-md");
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
      fireEvent.scroll(window);
    });
    expect(header).toHaveClass("border-transparent");
  });

  describe("mobile menu", () => {
    it("keeps an opaque blurred background while open at the top of the page", () => {
      render(<SiteHeader lang="es" />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("bg-transparent");
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      expect(header).toHaveClass("backdrop-blur-md");
      expect(header).toHaveClass("bg-background/85");
      expect(header).not.toHaveClass("bg-transparent");
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.closeLabel }));
      expect(header).toHaveClass("bg-transparent");
    });

    it("is closed by default and wired with aria-expanded/aria-controls", () => {
      render(<SiteHeader lang="es" />);
      const button = screen.getByRole("button", { name: mobileMenu.openLabel });
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveAttribute("aria-controls", "mobile-menu");
      expect(screen.queryByRole("navigation", { name: mobileMenu.navLabel })).toBeNull();
    });

    it("opens a nav with every section link", () => {
      render(<SiteHeader lang="es" />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      const button = screen.getByRole("button", { name: mobileMenu.closeLabel });
      expect(button).toHaveAttribute("aria-expanded", "true");
      const nav = screen.getByRole("navigation", { name: mobileMenu.navLabel });
      expect(nav).toHaveAttribute("id", "mobile-menu");
      for (const link of navLinks) {
        expect(nav).toContainElement(screen.getAllByRole("link", { name: link.label })[1]);
      }
    });

    it("closes when a link is clicked", () => {
      render(<SiteHeader lang="es" />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      const nav = screen.getByRole("navigation", { name: mobileMenu.navLabel });
      fireEvent.click(within(nav).getByRole("link", { name: navLinks[0].label }));
      expect(screen.queryByRole("navigation", { name: mobileMenu.navLabel })).toBeNull();
    });

    it("closes on Escape and returns focus to the toggle", () => {
      render(<SiteHeader lang="es" />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      fireEvent.keyDown(document, { key: "Escape" });
      const button = screen.getByRole("button", { name: mobileMenu.openLabel });
      expect(screen.queryByRole("navigation", { name: mobileMenu.navLabel })).toBeNull();
      expect(button).toHaveFocus();
    });

    describe("viewport growing past md", () => {
      type Listener = (e: { matches: boolean }) => void;
      let listeners: Listener[];
      let removed: number;

      beforeEach(() => {
        listeners = [];
        removed = 0;
        vi.stubGlobal(
          "matchMedia",
          vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            addEventListener: (_: string, l: Listener) => listeners.push(l),
            removeEventListener: (_: string, l: Listener) => {
              removed += 1;
              listeners = listeners.filter((x) => x !== l);
            },
          })),
        );
      });

      afterEach(() => {
        vi.unstubAllGlobals();
      });

      it("closes the open menu when the md media query starts matching", () => {
        render(<SiteHeader lang="es" />);
        expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 768px)");
        fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
        act(() => listeners.forEach((l) => l({ matches: true })));
        expect(screen.queryByRole("navigation", { name: mobileMenu.navLabel })).toBeNull();
        expect(screen.getByRole("button", { name: mobileMenu.openLabel })).toHaveAttribute(
          "aria-expanded",
          "false",
        );
      });

      it("keeps the menu open when the query stops matching", () => {
        render(<SiteHeader lang="es" />);
        fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
        act(() => listeners.forEach((l) => l({ matches: false })));
        expect(screen.getByRole("navigation", { name: mobileMenu.navLabel })).toBeInTheDocument();
      });

      it("removes the listener on unmount", () => {
        const { unmount } = render(<SiteHeader lang="es" />);
        unmount();
        expect(removed).toBeGreaterThan(0);
        expect(listeners).toHaveLength(0);
      });
    });

    it("does not crash when matchMedia is unavailable", () => {
      vi.stubGlobal("matchMedia", undefined);
      render(<SiteHeader lang="es" />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      expect(screen.getByRole("navigation", { name: mobileMenu.navLabel })).toBeInTheDocument();
      vi.unstubAllGlobals();
    });

    it("ignores other keys", () => {
      render(<SiteHeader lang="es" />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      fireEvent.keyDown(document, { key: "a" });
      expect(screen.getByRole("navigation", { name: mobileMenu.navLabel })).toBeInTheDocument();
    });
  });
});

describe("SiteHeader in English", () => {
  it("renders the English labels, links and CTA", () => {
    const { navLinks: en, mobileMenu: menu } = getSite("en");
    render(<SiteHeader lang="en" />);
    expect(screen.getByRole("link", { name: "NIDOU, home" })).toHaveAttribute("href", "#inicio");
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const link of en) expect(nav).toContainElement(screen.getByRole("link", { name: link.label }));
    expect(screen.getByRole("link", { name: "Join" })).toHaveAttribute("href", "#unete");
    expect(screen.getByRole("button", { name: menu.openLabel })).toBeInTheDocument();
  });
});

describe("SiteHeader language switcher", () => {
  it("shows the switcher in the desktop bar with the active language marked", () => {
    render(<SiteHeader lang="es" />);
    const nav = screen.getByRole("navigation", { name: "Idioma" });
    expect(within(nav).getByRole("link", { name: "Español" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  });

  it("labels the switcher in the page language", () => {
    render(<SiteHeader lang="en" />);
    expect(screen.getByRole("navigation", { name: "Language" })).toBeInTheDocument();
  });

  it("repeats the switcher inside the open mobile menu", () => {
    render(<SiteHeader lang="es" />);
    expect(screen.getAllByRole("navigation", { name: "Idioma" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
    const menu = screen.getByRole("navigation", { name: mobileMenu.navLabel });
    expect(within(menu).getByRole("navigation", { name: "Idioma" })).toBeInTheDocument();
    expect(within(menu).getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
  });
});
