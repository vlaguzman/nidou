import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { LanguageSwitcher } from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  it("renders its own labelled navigation with two links", () => {
    render(<LanguageSwitcher lang="en" path="/" label="Language" />);
    const nav = screen.getByRole("navigation", { name: "Language" });
    expect(nav.querySelectorAll("a")).toHaveLength(2);
  });

  it("uses the label it receives, so the page language decides the wording", () => {
    render(<LanguageSwitcher lang="es" path="/" label="Idioma" />);
    expect(screen.getByRole("navigation", { name: "Idioma" })).toBeInTheDocument();
  });

  it("shows short visible labels with the language name as accessible name", () => {
    render(<LanguageSwitcher lang="en" path="/" label="Language" />);
    expect(screen.getByRole("link", { name: "English" })).toHaveTextContent("EN");
    expect(screen.getByRole("link", { name: "Español" })).toHaveTextContent("ES");
  });

  it("links to the locale home from the home page", () => {
    render(<LanguageSwitcher lang="en" path="/" label="Language" />);
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
    expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es");
  });

  it("keeps the equivalent page when switching language", () => {
    render(<LanguageSwitcher lang="es" path="/otra" label="Idioma" />);
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en/otra");
    expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es/otra");
  });

  it("marks only the active language with aria-current and a distinct style", () => {
    render(<LanguageSwitcher lang="es" path="/" label="Idioma" />);
    const es = screen.getByRole("link", { name: "Español" });
    const en = screen.getByRole("link", { name: "English" });
    expect(es).toHaveAttribute("aria-current", "page");
    expect(en).not.toHaveAttribute("aria-current");
    expect(es.className).toContain("aria-[current=page]:font-semibold");
  });

  it("declares the language of each link", () => {
    render(<LanguageSwitcher lang="en" path="/" label="Language" />);
    const en = screen.getByRole("link", { name: "English" });
    const es = screen.getByRole("link", { name: "Español" });
    expect(en).toHaveAttribute("lang", "en");
    expect(en).toHaveAttribute("hreflang", "en");
    expect(es).toHaveAttribute("lang", "es");
    expect(es).toHaveAttribute("hreflang", "es");
  });

  describe("keeping the reader's section", () => {
    afterEach(() => {
      window.location.hash = "";
    });

    it("renders hash-free hrefs first, so the server markup never differs from the client's", () => {
      window.location.hash = "#bienestar";
      const html = renderToString(<LanguageSwitcher lang="es" path="/" label="Idioma" />);
      expect(html).toContain('href="/en"');
      expect(html).not.toContain("#bienestar");
    });

    it("carries the current hash over to the other language after mount", () => {
      window.location.hash = "#bienestar";
      render(<LanguageSwitcher lang="es" path="/" label="Idioma" />);
      expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en#bienestar");
      expect(screen.getByRole("link", { name: "Español" })).toHaveAttribute("href", "/es#bienestar");
    });

    it("follows the hash as the reader moves between sections", () => {
      render(<LanguageSwitcher lang="es" path="/" label="Idioma" />);
      expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
      act(() => {
        window.location.hash = "#historias";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });
      expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en#historias");
      act(() => {
        window.location.hash = "";
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      });
      expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("href", "/en");
    });
  });

  it("tells its parent when a language link is used", () => {
    const onNavigate = vi.fn();
    render(<LanguageSwitcher lang="es" path="/" label="Idioma" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("link", { name: "English" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
