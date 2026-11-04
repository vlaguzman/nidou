import { describe, expect, it } from "vitest";
import { shape } from "@/test/shape";
import { getEmotionalHistory } from "./emotionalHistory";

describe("emotionalHistory data", () => {
  it("has a five-level mood scale ordered from stormy to sunny", () => {
    const { moodScale } = getEmotionalHistory("es");
    expect(moodScale.map((m) => m.level)).toEqual([0, 1, 2, 3, 4]);
    expect(moodScale[0].mood).toBe("Tormentoso");
    expect(moodScale[4].mood).toBe("Luminoso");
    const en = getEmotionalHistory("en").moodScale;
    expect(en[0].mood).toBe("Stormy");
    expect(en[4].mood).toBe("Sunny");
  });

  it("resolves every timeline entry to a mood of the scale", () => {
    for (const lang of ["es", "en"] as const) {
      const { moodScale, moodTimeline } = getEmotionalHistory(lang);
      expect(moodTimeline).toHaveLength(6);
      for (const entry of moodTimeline) {
        expect(moodScale.map((m) => m.mood)).toContain(entry.mood);
        expect(entry.date.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the same mood levels across locales", () => {
    expect(getEmotionalHistory("en").moodTimeline.map((e) => e.level)).toEqual(
      getEmotionalHistory("es").moodTimeline.map((e) => e.level),
    );
  });

  it("uses lowercase Spanish month abbreviations for dates", () => {
    expect(getEmotionalHistory("es").moodTimeline.map((e) => e.date)).toEqual([
      "2 may",
      "9 may",
      "16 may",
      "23 may",
      "30 may",
      "6 jun",
    ]);
  });

  it("uses English month abbreviations for dates", () => {
    expect(getEmotionalHistory("en").moodTimeline.map((e) => e.date)).toEqual([
      "May 2",
      "May 9",
      "May 16",
      "May 23",
      "May 30",
      "Jun 6",
    ]);
  });

  it("has the quote copy", () => {
    expect(getEmotionalHistory("es").quote).toContain("darte cuenta cómo estás");
    expect(getEmotionalHistory("en").quote).toContain("noticing how you are");
  });

  it("has the same shape in both locales", () => {
    expect(shape(getEmotionalHistory("en"))).toEqual(shape(getEmotionalHistory("es")));
  });
});
