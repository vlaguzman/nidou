import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getGallery } from "@/data/gallery";
import { GallerySection } from "./GallerySection";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

const gallery = getGallery("es");

describe("GallerySection", () => {
  it("renders the copy and every photo with its alt text", () => {
    const { container } = render(<GallerySection lang="es" />);
    expect(screen.getByRole("heading", { name: gallery.heading })).toBeInTheDocument();
    for (const photo of gallery.photos) {
      expect(screen.getByAltText(photo.alt)).toBeInTheDocument();
    }
    expect(container.querySelector("section#comunidad")).not.toBeNull();
  });

  it("makes tall photos span two rows", () => {
    render(<GallerySection lang="es" />);
    const tall = screen.getByAltText(gallery.photos[0].alt).parentElement;
    const normal = screen.getByAltText(gallery.photos[1].alt).parentElement;
    expect(tall).toHaveClass("row-span-2");
    expect(normal).not.toHaveClass("row-span-2");
  });
});

describe("GallerySection in English", () => {
  it("renders the English heading and alt texts", () => {
    const en = getGallery("en");
    const { container } = render(<GallerySection lang="en" />);
    expect(screen.getByRole("heading", { name: en.heading })).toBeInTheDocument();
    for (const photo of en.photos) expect(screen.getByAltText(photo.alt)).toBeInTheDocument();
    expect(container.querySelector("section#comunidad")).not.toBeNull();
  });
});
