import type { Locale } from "@/i18n/config";

export type WellbeingContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  flow: string[];
  chart: { title: string; range: string; ariaLabel: string; values: number[]; labels: string[] };
};

// Gentle upward trend (0 = lower, 100 = higher wellbeing). Locale-neutral.
const CHART_VALUES = [38, 32, 45, 50, 44, 58, 66, 62, 74, 80];

const WELLBEING: Record<Locale, WellbeingContent> = {
  es: {
    eyebrow: "Bienestar con seguimiento",
    heading: "Tu bienestar también merece un seguimiento.",
    paragraphs: [
      "NIDOU no solo organiza encuentros. También te ayuda a entender cómo esos momentos impactan en tu bienestar emocional.",
      "Registras cómo te sientes antes de cada encuentro, participas, y al terminar reflexionas sobre cómo te ha hecho sentir. Con el tiempo, esos pequeños registros se convierten en una historia que te pertenece solo a ti.",
    ],
    flow: [
      "Cómo me siento antes",
      "Participo en un encuentro",
      "Cómo me siento después",
      "Mi evolución emocional",
    ],
    chart: {
      title: "Tu evolución emocional",
      range: "Últimas 10 semanas",
      ariaLabel:
        "Gráfica que muestra una evolución ascendente del bienestar emocional a lo largo de diez semanas",
      values: CHART_VALUES,
      labels: ["Sem 1", "", "", "Sem 4", "", "", "Sem 7", "", "", "Sem 10"],
    },
  },
  en: {
    eyebrow: "Tracking your wellbeing",
    heading: "Your wellbeing deserves some attention too.",
    paragraphs: [
      "NIDOU doesn't just organize gatherings. It also helps you understand how those moments affect your emotional wellbeing.",
      "You check in before each gathering, take part, and afterwards reflect on how it felt. Over time, those small check-ins become a story that belongs only to you.",
    ],
    flow: [
      "How I feel before",
      "I join a gathering",
      "How I feel after",
      "My emotional journey",
    ],
    chart: {
      title: "Your emotional journey",
      range: "Last 10 weeks",
      ariaLabel:
        "Chart showing wellbeing trending upward over ten weeks",
      values: CHART_VALUES,
      labels: ["Wk 1", "", "", "Wk 4", "", "", "Wk 7", "", "", "Wk 10"],
    },
  },
};

export function getWellbeing(lang: Locale): WellbeingContent {
  return WELLBEING[lang];
}
