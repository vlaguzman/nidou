import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getFeelings } from "./feelings";

const LOCALES = ["es", "en"] as const;

describe("feelings data", () => {
  it("has five moods with unique ids and titles", () => {
    for (const lang of LOCALES) {
      const { moods } = getFeelings(lang);
      expect(moods).toHaveLength(5);
      expect(new Set(moods.map((m) => m.id)).size).toBe(5);
      expect(new Set(moods.map((m) => m.title)).size).toBe(5);
    }
  });

  it("defaults to an existing mood", () => {
    for (const lang of LOCALES) {
      const { moods, defaultMoodId } = getFeelings(lang);
      expect(moods.map((m) => m.id)).toContain(defaultMoodId);
    }
  });

  it("only uses the warm and calm tones", () => {
    for (const lang of LOCALES) {
      for (const mood of getFeelings(lang).moods) expect(["warm", "calm"]).toContain(mood.tone);
    }
  });

  it("has the updated titles", () => {
    const t = Object.fromEntries(getFeelings("es").moods.map((m) => [m.id, m.title]));
    expect(t.agotada).toBe("Presencia compartida");
    expect(t.sola).toBe("¿Nos tomamos un café?");
    expect(t.saturada).toBe("Cita con el artista");
    expect(t.conectada).toBe("Creatividad en comunidad");
    const en = Object.fromEntries(getFeelings("en").moods.map((m) => [m.id, m.title]));
    expect(en.sola).toBe("Shall we grab a coffee?");
  });

  it("only the saturada mood has a join link (Google Form)", () => {
    const withHref = moods.filter((m) => m.joinHref);
    expect(withHref.map((m) => m.id)).toEqual(["saturada"]);
    expect(withHref[0].joinHref).toBe(
      "https://docs.google.com/forms/d/e/1FAIpQLSetgdHB1sEZDFp6GFSCGwF3d9zb43YxrrIwIEHou5MuWzPdWg/viewform?usp=header",
    );
  });

  it("has card copy", () => {
    expect(getFeelings("es").card.question).toBe("¿Cómo te sientes hoy?");
    expect(getFeelings("en").card.question).toBe("How are you feeling today?");
  });

  it("has the same shape in both locales", () => {
    expect(shape(getFeelings("en"))).toEqual(shape(getFeelings("es")));
  });
});
