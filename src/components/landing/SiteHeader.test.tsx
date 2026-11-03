import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mobileMenu, navLinks } from "@/data/site";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("links home through the logo", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "NIDOU, inicio" })).toHaveAttribute("href", "#inicio");
  });

  it("renders the webp logo with dimensions matching its aspect ratio", () => {
    render(<SiteHeader />);
    const logo = screen.getByAltText("NIDOU");
    expect(decodeURIComponent(logo.getAttribute("src") ?? "")).toContain("nidou-logo.webp");
    expect(Number(logo.getAttribute("width")) / Number(logo.getAttribute("height"))).toBeCloseTo(480 / 145, 1);
  });

  it("renders every nav link and the join CTA", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Principal" });
    for (const link of navLinks) {
      expect(nav).toContainElement(screen.getByRole("link", { name: link.label }));
    }
    expect(screen.getByRole("link", { name: "Únete" })).toHaveAttribute("href", "#unete");
  });

  it("gains a background once the page is scrolled", () => {
    render(<SiteHeader />);
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
      render(<SiteHeader />);
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
      render(<SiteHeader />);
      const button = screen.getByRole("button", { name: mobileMenu.openLabel });
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveAttribute("aria-controls", "mobile-menu");
      expect(screen.queryByRole("navigation", { name: mobileMenu.navLabel })).toBeNull();
    });

    it("opens a nav with every section link", () => {
      render(<SiteHeader />);
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
      render(<SiteHeader />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      const nav = screen.getByRole("navigation", { name: mobileMenu.navLabel });
      fireEvent.click(within(nav).getByRole("link", { name: navLinks[0].label }));
      expect(screen.queryByRole("navigation", { name: mobileMenu.navLabel })).toBeNull();
    });

    it("closes on Escape and returns focus to the toggle", () => {
      render(<SiteHeader />);
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
        render(<SiteHeader />);
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
        render(<SiteHeader />);
        fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
        act(() => listeners.forEach((l) => l({ matches: false })));
        expect(screen.getByRole("navigation", { name: mobileMenu.navLabel })).toBeInTheDocument();
      });

      it("removes the listener on unmount", () => {
        const { unmount } = render(<SiteHeader />);
        unmount();
        expect(removed).toBeGreaterThan(0);
        expect(listeners).toHaveLength(0);
      });
    });

    it("does not crash when matchMedia is unavailable", () => {
      vi.stubGlobal("matchMedia", undefined);
      render(<SiteHeader />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      expect(screen.getByRole("navigation", { name: mobileMenu.navLabel })).toBeInTheDocument();
      vi.unstubAllGlobals();
    });

    it("ignores other keys", () => {
      render(<SiteHeader />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      fireEvent.keyDown(document, { key: "a" });
      expect(screen.getByRole("navigation", { name: mobileMenu.navLabel })).toBeInTheDocument();
    });
  });
});
