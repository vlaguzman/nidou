import type { Locale } from "@/i18n/config";

export type CommunityIntroContent = {
  logo: { src: string; alt: string };
  statement: string;
  supporting: string;
};

const LOGO = { src: "/nidou-logo.webp", alt: "NIDOU" };

const COMMUNITY_INTRO: Record<Locale, CommunityIntroContent> = {
  es: {
    logo: LOGO,
    statement:
      "es una comunidad donde nos encontramos, compartimos y acompañamos nuestra evolución emocional a lo largo de la maternidad.",
    supporting:
      "No solo importa cómo nos sentimos hoy, también importa cómo vamos cambiando a lo largo del camino.",
  },
  en: {
    logo: LOGO,
    statement:
      "is a community where we meet, share and keep each other company as our emotions shift through motherhood.",
    supporting:
      "How we feel today matters. So does how we change along the way.",
  },
};

export function getCommunityIntro(lang: Locale): CommunityIntroContent {
  return COMMUNITY_INTRO[lang];
}
