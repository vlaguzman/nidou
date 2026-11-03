import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mobileMenu, navLinks } from "@/data/site";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("links home through the logo", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "NIDOU, inicio" })).toHaveAttribute("href", "#inicio");
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

    it("ignores other keys", () => {
      render(<SiteHeader />);
      fireEvent.click(screen.getByRole("button", { name: mobileMenu.openLabel }));
      fireEvent.keyDown(document, { key: "a" });
      expect(screen.getByRole("navigation", { name: mobileMenu.navLabel })).toBeInTheDocument();
    });
  });
});
