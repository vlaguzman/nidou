import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getFeelings } from "@/data/feelings";
import { FeelingCard } from "./FeelingCard";

const feelings = getFeelings("es");
const { moods } = feelings;

describe("FeelingCard", () => {
  it("asks how the user feels and lists every mood", () => {
    render(<FeelingCard content={feelings} />);
    expect(screen.getByRole("heading", { name: "¿Cómo te sientes hoy?" })).toBeInTheDocument();
    for (const mood of moods) {
      expect(screen.getByRole("button", { name: mood.label })).toBeInTheDocument();
    }
  });

  it("preselects Conectada", () => {
    render(<FeelingCard content={feelings} />);
    expect(screen.getByRole("button", { name: "Conectada" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Sola" })).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps the suggestion face out of reach until a mood is chosen", () => {
    const { container } = render(<FeelingCard content={feelings} />);
    const faces = container.querySelectorAll("[data-face]");
    expect(faces[0]).not.toHaveAttribute("inert");
    expect(faces[1]).toHaveAttribute("inert");
    expect(faces[1]).not.toHaveAttribute("aria-hidden");
  });

  it("flips to the suggestion for the chosen mood and flips back", () => {
    const { container } = render(<FeelingCard content={feelings} />);
    fireEvent.click(screen.getByRole("button", { name: "Sola" }));
    expect(screen.getByRole("heading", { name: "¿Nos tomamos un café?" })).toBeInTheDocument();
    expect(screen.getByText(/Para ti · Sola/)).toBeInTheDocument();
    const faces = container.querySelectorAll("[data-face]");
    expect(faces[0]).toHaveAttribute("inert");
    expect(faces[1]).not.toHaveAttribute("inert");

    fireEvent.click(screen.getByRole("button", { name: /Volver/ }));
    expect(faces[0]).not.toHaveAttribute("inert");
  });

  it("links the Sola mood to the Google Form in a new tab", () => {
    render(<FeelingCard content={feelings} />);
    fireEvent.click(screen.getByRole("button", { name: "Sola" }));
    const link = screen.getByRole("link", { name: "Me sumo al siguiente" });
    expect(link).toHaveAttribute("href", moods.find((m) => m.id === "sola")!.joinHref);
    expect(link).toHaveAttribute(
      "href",
      "https://docs.google.com/forms/d/e/1FAIpQLSetgdHB1sEZDFp6GFSCGwF3d9zb43YxrrIwIEHou5MuWzPdWg/viewform?usp=header",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("keeps the placeholder button for moods without a join link", () => {
    render(<FeelingCard content={feelings} />);
    fireEvent.click(screen.getByRole("button", { name: "Agotada" }));
    expect(screen.queryByRole("link", { name: "Me sumo al siguiente" })).toBeNull();
    expect(screen.getByRole("button", { name: "Me sumo al siguiente" })).toBeInTheDocument();
  });

  it("styles warm and calm moods differently when selected", () => {
    render(<FeelingCard content={feelings} />);
    expect(screen.getByRole("button", { name: "Conectada" })).toHaveClass("bg-secondary");
    fireEvent.click(screen.getByRole("button", { name: "Agotada" }));
    // After flipping, the front face is aria-hidden, so query hidden elements too.
    expect(screen.getByRole("button", { name: "Agotada", hidden: true })).toHaveClass("bg-accent-text");
  });

  it("moves focus to the suggestion heading after flipping", () => {
    render(<FeelingCard content={feelings} />);
    fireEvent.click(screen.getByRole("button", { name: "Sola" }));
    const heading = screen.getByRole("heading", { name: "¿Nos tomamos un café?" });
    expect(heading).toHaveAttribute("tabindex", "-1");
    expect(heading).toHaveFocus();
  });

  it("returns focus to the selected mood chip on Volver", () => {
    render(<FeelingCard content={feelings} />);
    fireEvent.click(screen.getByRole("button", { name: "Sola" }));
    fireEvent.click(screen.getByRole("button", { name: /Volver/ }));
    expect(screen.getByRole("button", { name: "Sola" })).toHaveFocus();
  });

  it("does not steal focus on first render", () => {
    render(<FeelingCard content={feelings} />);
    expect(document.body).toHaveFocus();
  });

  it("stacks both faces in one grid cell so the card grows with the longest copy", () => {
    const { container } = render(<FeelingCard content={feelings} />);
    const faces = container.querySelectorAll("[data-face]");
    for (const face of faces) {
      expect(face).toHaveClass("col-start-1", "row-start-1");
      expect(face).not.toHaveClass("absolute");
    }
    expect(faces[0].parentElement).toHaveClass("grid");
  });
});

describe("FeelingCard in English", () => {
  const en = getFeelings("en");

  it("renders the English question, moods and default selection", () => {
    render(<FeelingCard content={en} />);
    expect(screen.getByRole("heading", { name: "How are you feeling today?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Connected" })).toHaveAttribute("aria-pressed", "true");
  });

  it("flips to the English suggestion and keeps the shared form link", () => {
    render(<FeelingCard content={en} />);
    fireEvent.click(screen.getByRole("button", { name: "Lonely" }));
    expect(screen.getByRole("heading", { name: "Shall we grab a coffee?" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: en.card.join });
    expect(link).toHaveAttribute("href", moods.find((m) => m.id === "sola")!.joinHref);
    expect(screen.getByRole("button", { name: /Back/ })).toBeInTheDocument();
  });
});
