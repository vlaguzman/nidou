import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { flow } from "@/data/wellbeing";
import { WellbeingSection } from "./WellbeingSection";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

describe("WellbeingSection", () => {
  it("renders the copy, the chart and the ordered flow", () => {
    render(<WellbeingSection />);
    expect(screen.getByRole("heading", { name: "Tu bienestar también merece un seguimiento." })).toBeInTheDocument();
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(flow.length);
  });

  it("is the target of the wellbeing anchor", () => {
    const { container } = render(<WellbeingSection />);
    expect(container.querySelector("section#bienestar")).not.toBeNull();
  });
});
