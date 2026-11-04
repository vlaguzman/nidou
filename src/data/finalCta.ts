import type { Locale } from "@/i18n/config";

export type FinalCtaContent = {
  heading: string;
  description: string;
  form: { emailLabel: string; emailPlaceholder: string; submitLabel: string };
  thanks: string;
};

const FINAL_CTA: Record<Locale, FinalCtaContent> = {
  es: {
    heading: "Tu refugio también puede empezar aquí.",
    description:
      "Empieza a construir una red donde tus emociones también tienen un espacio.",
    form: {
      emailLabel: "Tu correo electrónico",
      emailPlaceholder: "Tu correo electrónico",
      submitLabel: "Únete a la comunidad",
    },
    thanks:
      "Gracias por tu interés. Aún estamos preparando la comunidad; te avisaremos cuando abramos. 🌿",
  },
  en: {
    heading: "Your refuge can start here, too.",
    description:
      "Start building a network where your emotions have room too.",
    form: {
      emailLabel: "Your email address",
      emailPlaceholder: "Your email address",
      submitLabel: "Join the community",
    },
    thanks:
      "Thanks for your interest. We're still getting the community ready, and we'll let you know when we open. 🌿",
  },
};

export function getFinalCta(lang: Locale): FinalCtaContent {
  return FINAL_CTA[lang];
}
