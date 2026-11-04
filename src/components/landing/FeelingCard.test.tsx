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

  it("no longer shows the fixed weekly insight line on the front", () => {
    render(<FeelingCard content={feelings} />);
    expect(screen.queryByText(/Esta semana muchas madres/)).toBeNull();
  });

  it("shows each mood's own insight on the back, with its source when present", () => {
    for (const mood of moods) {
      const { unmount } = render(<FeelingCard content={feelings} />);
      fireEvent.click(screen.getByRole("button", { name: mood.label }));
      expect(screen.getByText(mood.insight.text)).toBeInTheDocument();
      if (mood.insight.source) {
        expect(screen.getByText(`Fuente: ${mood.insight.source}`)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(/Fuente:/)).toBeNull();
      }
      unmount();
    }
  });

  it("keeps the insight inside the inert back face until flipped", () => {
    const { container } = render(<FeelingCard content={feelings} />);
    const back = container.querySelector('[data-face="back"]')!;
    expect(back).toHaveAttribute("inert");
    expect(back).toHaveTextContent(moods.find((m) => m.id === "conectada")!.insight.text);
    expect(container.querySelector('[data-face="front"]')).not.toHaveTextContent(
      moods.find((m) => m.id === "conectada")!.insight.text,
    );
  });

  it("collapses the insight while the front shows, so it does not set the card height", () => {
    const { container } = render(<FeelingCard content={feelings} />);
    const insight = container.querySelector("[data-insight]")!;
    expect(insight).toHaveAttribute("data-state", "closed");
    expect(insight.className).toContain("grid-rows-[0fr]");

    fireEvent.click(screen.getByRole("button", { name: "Sola" }));
    expect(insight).toHaveAttribute("data-state", "open");
    expect(insight.className).toContain("grid-rows-[1fr]");

    fireEvent.click(screen.getByRole("button", { name: /Volver/ }));
    expect(insight).toHaveAttribute("data-state", "closed");
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

  it("links the Saturada mood to the Google Form in a new tab", () => {
    render(<FeelingCard content={feelings} />);
    fireEvent.click(screen.getByRole("button", { name: "Saturada" }));
    const link = screen.getByRole("link", { name: "Me sumo al siguiente" });
    expect(link).toHaveAttribute("href", moods.find((m) => m.id === "saturada")!.joinHref);
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

  it("sizes the card to the visible face only", () => {
    const { container } = render(<FeelingCard content={feelings} />);
    const [front, back] = container.querySelectorAll("[data-face]");
    expect(front.parentElement).toHaveClass("relative");
    expect(front).not.toHaveClass("absolute");
    expect(back).toHaveClass("absolute");

    fireEvent.click(screen.getByRole("button", { name: "Sola" }));
    expect(front).toHaveClass("absolute");
    expect(back).not.toHaveClass("absolute");
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
    fireEvent.click(screen.getByRole("button", { name: "Overwhelmed" }));
    expect(screen.getByRole("heading", { name: "Date with the artist" })).toBeInTheDocument();
    const link = screen.getByRole("link", { name: en.card.join });
    expect(link).toHaveAttribute("href", moods.find((m) => m.id === "saturada")!.joinHref);
    expect(screen.getByRole("button", { name: /Back/ })).toBeInTheDocument();
  });

  it("shows the English insight with a Source line", () => {
    render(<FeelingCard content={en} />);
    fireEvent.click(screen.getByRole("button", { name: "Lonely" }));
    expect(
      screen.getByText("62% of mothers and fathers felt lonely or isolated after having a baby."),
    ).toBeInTheDocument();
    expect(screen.getByText("Source: NCT, 2026")).toBeInTheDocument();
  });
});
