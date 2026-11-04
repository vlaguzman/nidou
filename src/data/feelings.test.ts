import { describe, expect, it } from "vitest";
import { defaultMoodId, feelingCard, moods } from "./feelings";

describe("feelings data", () => {
  it("has five moods with unique ids and titles", () => {
    expect(moods).toHaveLength(5);
    expect(new Set(moods.map((m) => m.id)).size).toBe(5);
    expect(new Set(moods.map((m) => m.title)).size).toBe(5);
  });

  it("defaults to an existing mood", () => {
    expect(moods.map((m) => m.id)).toContain(defaultMoodId);
  });

  it("only uses the warm and calm tones", () => {
    for (const mood of moods) expect(["warm", "calm"]).toContain(mood.tone);
  });

  it("has the updated titles", () => {
    const t = Object.fromEntries(moods.map((m) => [m.id, m.title]));
    expect(t.agotada).toBe("Presencia compartida");
    expect(t.sola).toBe("¿Nos tomamos un café?");
    expect(t.saturada).toBe("Cita con el artista");
    expect(t.conectada).toBe("Creatividad en comunidad");
  });

  it("only the saturada mood has a join link (Google Form)", () => {
    const withHref = moods.filter((m) => m.joinHref);
    expect(withHref.map((m) => m.id)).toEqual(["saturada"]);
    expect(withHref[0].joinHref).toBe(
      "https://docs.google.com/forms/d/e/1FAIpQLSetgdHB1sEZDFp6GFSCGwF3d9zb43YxrrIwIEHou5MuWzPdWg/viewform?usp=header",
    );
  });

  it("has card copy", () => {
    expect(feelingCard.question).toBe("¿Cómo te sientes hoy?");
  });
});
