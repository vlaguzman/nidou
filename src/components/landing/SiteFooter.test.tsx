import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getSite } from "@/data/site";
import { SiteFooter } from "./SiteFooter";

const { footer } = getSite("es");

describe("SiteFooter", () => {
  it("renders the webp logo with dimensions matching its aspect ratio", () => {
    render(<SiteFooter lang="es" />);
    const logo = screen.getByAltText("NIDOU");
    expect(decodeURIComponent(logo.getAttribute("src") ?? "")).toContain("nidou-logo.webp");
    expect(Number(logo.getAttribute("width")) / Number(logo.getAttribute("height"))).toBeCloseTo(480 / 145, 1);
  });

  it("renders the tagline and every link column", () => {
    render(<SiteFooter lang="es" />);
    expect(screen.getByText(footer.tagline)).toBeInTheDocument();
    for (const column of footer.columns) {
      expect(screen.getByRole("heading", { name: column.title })).toBeInTheDocument();
      for (const link of column.links) {
        expect(screen.getAllByRole("link", { name: link.label }).length).toBeGreaterThan(0);
      }
    }
  });

  it("offers an email link and a social link", () => {
    render(<SiteFooter lang="es" />);
    expect(screen.getByRole("link", { name: "Escríbenos un correo" })).toHaveAttribute("href", `mailto:${footer.email}`);
    expect(screen.getByRole("link", { name: "Síguenos en Instagram" })).toBeInTheDocument();
  });

  it("shows the current year", () => {
    render(<SiteFooter lang="es" />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} NIDOU`))).toBeInTheDocument();
  });
});

describe("SiteFooter in English", () => {
  it("renders the English tagline, links and accessible names", () => {
    const { footer: en } = getSite("en");
    render(<SiteFooter lang="en" />);
    expect(screen.getByText(en.tagline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Send us an email" })).toHaveAttribute("href", `mailto:${en.email}`);
    expect(screen.getByRole("link", { name: "Follow us on Instagram" })).toBeInTheDocument();
    expect(screen.getByText(/Made with calm\./)).toBeInTheDocument();
  });
});
