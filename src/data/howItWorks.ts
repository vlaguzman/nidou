import type { Locale } from "@/i18n/config";

export type HowItWorksContent = {
  heading: string;
  subtitle: string;
  steps: string[];
};

const HOW_IT_WORKS: Record<Locale, HowItWorksContent> = {
  es: {
    heading: "Así funciona",
    subtitle: "Cinco pasos sencillos para acompañarte en cada etapa.",
    steps: [
      "Comparte cómo te sientes.",
      "Descubre encuentros pensados para ti.",
      "Conecta con otras madres.",
      "Reflexiona después de la experiencia.",
      "Observa cómo evoluciona tu bienestar.",
    ],
  },
  en: {
    heading: "How it works",
    subtitle: "Five simple steps to walk beside you at every stage.",
    steps: [
      "Share how you are feeling.",
      "Discover gatherings made for you.",
      "Connect with other mothers.",
      "Reflect after the experience.",
      "Watch your wellbeing evolve.",
    ],
  },
};

export function getHowItWorks(lang: Locale): HowItWorksContent {
  return HOW_IT_WORKS[lang];
}
