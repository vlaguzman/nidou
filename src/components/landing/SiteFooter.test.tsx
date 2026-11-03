import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { footer } from "@/data/site";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  it("renders the tagline and every link column", () => {
    render(<SiteFooter />);
    expect(screen.getByText(footer.tagline)).toBeInTheDocument();
    for (const column of footer.columns) {
      expect(screen.getByRole("heading", { name: column.title })).toBeInTheDocument();
      for (const link of column.links) {
        expect(screen.getAllByRole("link", { name: link.label }).length).toBeGreaterThan(0);
      }
    }
  });

  it("offers an email link and a social link", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Escríbenos un correo" })).toHaveAttribute("href", `mailto:${footer.email}`);
    expect(screen.getByRole("link", { name: "Síguenos en Instagram" })).toBeInTheDocument();
  });

  it("shows the current year", () => {
    render(<SiteFooter />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} NIDOU`))).toBeInTheDocument();
  });
});
