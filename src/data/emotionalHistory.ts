import { Cloud, CloudLightning, CloudRain, CloudSun, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Locale } from "@/i18n/config";

export type MoodLevel = { level: number; mood: string; icon: LucideIcon; color: string };

export type EmotionalHistoryContent = {
  eyebrow: string;
  heading: string;
  quote: string;
  paragraphs: string[];
  card: { title: string; subtitle: string };
  moodScale: MoodLevel[];
  moodTimeline: (MoodLevel & { date: string })[];
};

// Level 0 = hardest day (stormy), level 4 = brightest day (sunny). Icons, colours and levels are locale-neutral.
const SCALE = [
  { icon: CloudLightning, color: "text-foreground" },
  { icon: CloudRain, color: "text-foreground/70" },
  { icon: Cloud, color: "text-muted-foreground" },
  { icon: CloudSun, color: "text-secondary-text" },
  { icon: Sun, color: "text-accent-text" },
];

const TIMELINE_LEVELS = [0, 1, 2, 3, 4, 1];

type Text = {
  eyebrow: string;
  heading: string;
  quote: string;
  paragraphs: string[];
  card: { title: string; subtitle: string };
  moods: string[];
  dates: string[];
};

const TEXT: Record<Locale, Text> = {
  es: {
    eyebrow: "Autoconocimiento",
    heading: "Tu historia emocional",
    quote: "No se trata de siempre estar bien, sino de darte cuenta cómo estás.",
    paragraphs: [
      "Con el tiempo, cada madre puede descubrir patrones, reconocer los momentos más difíciles y valorar qué experiencias le ayudan a sentirse mejor.",
      "No es un análisis clínico. Es una forma serena de conocerte mejor y de recordarte, en los días difíciles, todo el camino que ya has recorrido.",
    ],
    card: {
      title: "Tu registro emocional",
      subtitle: "Una mirada a tu camino, sin presión.",
    },
    moods: ["Tormentoso", "Lluvioso", "Nublado", "Despejando", "Luminoso"],
    dates: ["2 may", "9 may", "16 may", "23 may", "30 may", "6 jun"],
  },
  en: {
    eyebrow: "Self-awareness",
    heading: "Your emotional story",
    quote: "It's not about always being okay. It's about noticing how you are.",
    paragraphs: [
      "Over time, you can spot patterns, recognize your hardest moments and see which experiences help you feel better.",
      "It isn't a clinical assessment. It's a gentle way to know yourself better and to remember, on the hard days, how far you've already come.",
    ],
    card: {
      title: "Your emotional log",
      subtitle: "A look at your journey, with no pressure.",
    },
    moods: ["Stormy", "Rainy", "Cloudy", "Clearing up", "Sunny"],
    dates: ["May 2", "May 9", "May 16", "May 23", "May 30", "Jun 6"],
  },
};

function build(lang: Locale): EmotionalHistoryContent {
  const { moods, dates, ...copy } = TEXT[lang];
  const moodScale = SCALE.map((s, level) => ({ level, mood: moods[level], ...s }));
  const moodTimeline = TIMELINE_LEVELS.map((level, i) => ({ date: dates[i], ...moodScale[level] }));
  return { ...copy, moodScale, moodTimeline };
}

const EMOTIONAL_HISTORY: Record<Locale, EmotionalHistoryContent> = {
  es: build("es"),
  en: build("en"),
};

export function getEmotionalHistory(lang: Locale): EmotionalHistoryContent {
  return EMOTIONAL_HISTORY[lang];
}
