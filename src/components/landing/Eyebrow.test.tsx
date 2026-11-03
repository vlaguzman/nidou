import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Eyebrow } from "./Eyebrow";

describe("Eyebrow", () => {
  it("renders its text", () => {
    render(<Eyebrow>Autoconocimiento</Eyebrow>);
    expect(screen.getByText("Autoconocimiento")).toBeInTheDocument();
  });

  it("uses the text-safe accent token for AA contrast", () => {
    render(<Eyebrow>Autoconocimiento</Eyebrow>);
    expect(screen.getByText("Autoconocimiento")).toHaveClass("text-accent-text");
  });
});
