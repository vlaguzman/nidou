import { describe, expect, it } from "vitest";
import { getCommunityIntro } from "./communityIntro";
import { getEmotionalHistory } from "./emotionalHistory";
import { getFeelings } from "./feelings";
import { getFinalCta } from "./finalCta";
import { getGallery } from "./gallery";
import { getHowItWorks } from "./howItWorks";
import { getSite } from "./site";
import { getTestimonials } from "./testimonials";
import { getValues } from "./values";
import { getWellbeing } from "./wellbeing";

/** Every string reachable from a content object (component references are skipped). */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.values(value).flatMap(strings);
  }
  return [];
}

const english = strings([
  getCommunityIntro("en"),
  getEmotionalHistory("en"),
  getFeelings("en"),
  getFinalCta("en"),
  getGallery("en"),
  getHowItWorks("en"),
  getSite("en"),
  getTestimonials("en"),
  getValues("en"),
  getWellbeing("en"),
]).join("\n");

describe("English copy", () => {
  it("uses one spelling (American) and one word for mothers everywhere", () => {
    expect(english).not.toMatch(/\b(mum|mums|moms|mommy)\b/i);
    expect(english).not.toMatch(/\b(realis|recognis|organis|colour)/i);
  });

  it("is peer-to-peer: second person, contractions, no distant third person", () => {
    expect(getCommunityIntro("en").supporting).toBe("How we feel today matters. So does how we change along the way.");
    expect(getEmotionalHistory("en").paragraphs[0]).toMatch(/^Over time, you can spot patterns/);
    expect(getEmotionalHistory("en").quote).toBe("It's not about always being okay. It's about noticing how you are.");
  });

  it("names things the same way across sections", () => {
    const { moods } = getFeelings("en");
    expect(moods.find((m) => m.id === "sola")?.description).toContain("mothers who probably feel the way you do");
    expect(getFeelings("en").moods.find((m) => m.id === "saturada")?.title).toBe("Date with the artist");
    expect(getTestimonials("en").items[0].detail).toBe("Date with the artist");
  });

  it("sounds spoken rather than translated or salesy", () => {
    expect(getHowItWorks("en").subtitle).toBe("Five simple steps to support you at every stage.");
    expect(getHowItWorks("en").steps[1]).toBe("Find gatherings made for you.");
    expect(getFinalCta("en").heading).toBe("Your refuge can start here, too.");
    expect(getFinalCta("en").thanks).toMatch(/^Thanks for your interest\. We're still getting/);
    expect(getValues("en").heading).toBe("Because looking after yourself is also looking after the people you love most.");
    expect(getGallery("en").heading).toBe("We don't just bring mothers together. We build bonds.");
    expect(getWellbeing("en").eyebrow).toBe("Tracking your wellbeing");
    expect(getSite("en").footer.tagline).toBe(
      "Motherhood, lived together. A space to feel supported and to look after your emotions.",
    );
  });
});
