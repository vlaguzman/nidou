import { describe, expect, it } from "vitest";
import { emotionalHistory, moodScale, moodTimeline } from "./emotionalHistory";

describe("emotionalHistory data", () => {
  it("has a five-level mood scale ordered from stormy to sunny", () => {
    expect(moodScale.map((m) => m.level)).toEqual([0, 1, 2, 3, 4]);
    expect(moodScale[0].mood).toBe("Tormentoso");
    expect(moodScale[4].mood).toBe("Luminoso");
  });

  it("resolves every timeline entry to a mood of the scale", () => {
    expect(moodTimeline).toHaveLength(6);
    for (const entry of moodTimeline) {
      expect(moodScale.map((m) => m.mood)).toContain(entry.mood);
      expect(entry.date.length).toBeGreaterThan(0);
    }
  });

  it("has the quote copy", () => {
    expect(emotionalHistory.quote).toContain("darte cuenta cómo estás");
  });
});
