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

  it("has card copy", () => {
    expect(feelingCard.question).toBe("¿Cómo te sientes hoy?");
  });
});
