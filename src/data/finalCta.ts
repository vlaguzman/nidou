import type { Locale } from "@/i18n/config";

export type FinalCtaContent = {
  heading: string;
  description: string;
  form: { emailLabel: string; emailPlaceholder: string; submitLabel: string };
  thanks: string;
  /** `message` holds an `{email}` placeholder filled in with the visitor's address. */
  whatsapp: { phone: string; message: string; fallbackLabel: string };
};

// Locale-neutral: signups go to this WhatsApp number in both locales.
const WHATSAPP_PHONE = "+44 7950 745207";

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
      "Gracias por tu interés. Te abrimos WhatsApp con tu mensaje listo: envíalo y te escribiremos. 🌿",
    whatsapp: {
      phone: WHATSAPP_PHONE,
      message: "Hola NIDOU, quiero unirme a la comunidad. Mi correo es {email}",
      fallbackLabel: "¿No se abrió WhatsApp? Ábrelo aquí",
    },
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
      "Thanks for your interest. We've opened WhatsApp with your message ready: send it and we'll get back to you. 🌿",
    whatsapp: {
      phone: WHATSAPP_PHONE,
      message: "Hi NIDOU, I'd like to join the community. My email is {email}",
      fallbackLabel: "WhatsApp didn't open? Open it here",
    },
  },
};

export function getFinalCta(lang: Locale): FinalCtaContent {
  return FINAL_CTA[lang];
}
