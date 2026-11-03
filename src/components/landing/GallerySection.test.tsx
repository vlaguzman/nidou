import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { gallery } from "@/data/gallery";
import { GallerySection } from "./GallerySection";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("GallerySection", () => {
  it("renders the copy and every photo with its alt text", () => {
    const { container } = render(<GallerySection />);
    expect(screen.getByRole("heading", { name: gallery.heading })).toBeInTheDocument();
    for (const photo of gallery.photos) {
      expect(screen.getByAltText(photo.alt)).toBeInTheDocument();
    }
    expect(container.querySelector("section#comunidad")).not.toBeNull();
  });

  it("makes tall photos span two rows", () => {
    render(<GallerySection />);
    const tall = screen.getByAltText(gallery.photos[0].alt).parentElement;
    const normal = screen.getByAltText(gallery.photos[1].alt).parentElement;
    expect(tall).toHaveClass("row-span-2");
    expect(normal).not.toHaveClass("row-span-2");
  });
});
