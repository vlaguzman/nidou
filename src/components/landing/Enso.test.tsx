import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Enso } from "./Enso";

describe("Enso", () => {
  it("is labelled for assistive tech", () => {
    render(<Enso />);
    expect(screen.getByRole("img", { name: "Símbolo de NIDOU" })).toBeInTheDocument();
  });

  it("animates by default", () => {
    const { container } = render(<Enso />);
    expect(container.querySelector(".enso-stroke")).not.toBeNull();
    expect(container.querySelector(".enso-dot")).not.toBeNull();
  });

  it("can be rendered static", () => {
    const { container } = render(<Enso animate={false} />);
    expect(container.querySelector(".enso-stroke")).toBeNull();
    expect(container.querySelector(".enso-dot")).toBeNull();
  });
});
