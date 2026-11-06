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
    expect(en.sola).toBe("Want to grab a coffee?");
  });

  it("links saturada to its event form and every other mood to the community form", () => {
    for (const lang of LOCALES) {
      const hrefs = Object.fromEntries(getFeelings(lang).moods.map((m) => [m.id, m.joinHref]));
      expect(hrefs).toEqual({
        agotada: "https://docs.google.com/forms/d/e/1FAIpQLSc5gm7dmLdB6mSSAJpODuWG0phQUaINnxYfgAkG6Y7771pWcQ/viewform",
        sola: "https://docs.google.com/forms/d/e/1FAIpQLSc5gm7dmLdB6mSSAJpODuWG0phQUaINnxYfgAkG6Y7771pWcQ/viewform",
        saturada: "https://docs.google.com/forms/d/e/1FAIpQLSetgdHB1sEZDFp6GFSCGwF3d9zb43YxrrIwIEHou5MuWzPdWg/viewform?usp=header",
        conectada: "https://docs.google.com/forms/d/e/1FAIpQLSc5gm7dmLdB6mSSAJpODuWG0phQUaINnxYfgAkG6Y7771pWcQ/viewform",
        esperanzada: "https://docs.google.com/forms/d/e/1FAIpQLSc5gm7dmLdB6mSSAJpODuWG0phQUaINnxYfgAkG6Y7771pWcQ/viewform",
      });
    }
  });

  it("gives every mood its own insight in both locales, with sources only on the stat moods", () => {
    const sources = {
      agotada: "NCT, 2026",
      sola: "NCT, 2026",
      saturada: "The Lancet Public Health, 2023",
    } as Record<string, string>;
    for (const lang of LOCALES) {
      const { moods, card } = getFeelings(lang);
      expect(card).not.toHaveProperty("insight");
      for (const mood of moods) {
        expect(mood.insight.text.length).toBeGreaterThan(0);
        expect(mood.insight.source).toBe(sources[mood.id]);
      }
      expect(moods.filter((m) => m.tone === "calm").every((m) => m.insight.source === undefined)).toBe(true);
    }
    expect(getFeelings("es").card.sourceLabel).toBe("Fuente");
    expect(getFeelings("en").card.sourceLabel).toBe("Source");
    expect(getFeelings("es").moods.find((m) => m.id === "sola")?.insight.text).toBe(
      "En Reino Unido, el 62% de las madres y padres se sintió solo o aislado al menos parte del tiempo después de tener un bebé.",
    );
  });

  it("has card copy", () => {
    expect(getFeelings("es").card.question).toBe("¿Cómo te sientes hoy?");
    expect(getFeelings("en").card.question).toBe("How are you feeling today?");
  });

  it("has the same shape in both locales", () => {
    expect(shape(getFeelings("en"))).toEqual(shape(getFeelings("es")));
  });

  it("states the NCT scope and rounding honestly for agotada", () => {
    expect(getFeelings("es").moods.find((m) => m.id === "agotada")!.insight.text).toBe(
      'En Reino Unido, cerca de 1 de cada 8 madres y padres dijo sentirse solo siempre después de tener un bebé. No tienes que cargar con todo sola.',
    );
    expect(getFeelings("en").moods.find((m) => m.id === "agotada")!.insight.text).toBe(
      "In the UK, nearly 1 in 8 mothers and fathers said they always felt lonely after having a baby. You don't have to carry it all alone.",
    );
  });
});
