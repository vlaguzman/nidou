import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getWellbeing } from "@/data/wellbeing";
import { WellbeingSection } from "./WellbeingSection";

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
});

const { flow } = getWellbeing("es");

describe("WellbeingSection", () => {
  it("renders the copy, the chart and the ordered flow", () => {
    render(<WellbeingSection lang="es" />);
    expect(screen.getByRole("heading", { name: "Tu bienestar también merece un seguimiento." })).toBeInTheDocument();
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(flow.length);
  });

  it("is the target of the wellbeing anchor", () => {
    const { container } = render(<WellbeingSection lang="es" />);
    expect(container.querySelector("section#bienestar")).not.toBeNull();
  });
});

describe("WellbeingSection in English", () => {
  it("renders the English copy, chart label and flow", () => {
    const en = getWellbeing("en");
    render(<WellbeingSection lang="en" />);
    expect(screen.getByRole("heading", { name: en.heading })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: en.chart.ariaLabel })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(en.flow.length);
  });
});
