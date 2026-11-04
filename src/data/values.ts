import { Ear, Sprout, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Locale } from "@/i18n/config";

export type ValuesContent = {
  heading: string;
  items: { icon: LucideIcon; title: string; text: string }[];
};

const VALUES: Record<Locale, ValuesContent> = {
  es: {
    heading: "Porque cuidar de ti también es cuidar de quien más quieres.",
    items: [
      {
        icon: Ear,
        title: "Escucharte",
        text: "Antes de cada encuentro puedes registrar cómo te sientes.",
      },
      {
        icon: Users,
        title: "Conectar",
        text: "Descubre madres con historias y momentos parecidos al tuyo.",
      },
      {
        icon: Sprout,
        title: "Crecer",
        text: "Observa cómo cambia tu bienestar con el paso del tiempo.",
      },
    ],
  },
  en: {
    heading: "Because looking after yourself is also looking after the people you love most.",
    items: [
      {
        icon: Ear,
        title: "Listen to yourself",
        text: "Before each gathering, you can check in with how you're feeling.",
      },
      {
        icon: Users,
        title: "Connect",
        text: "Meet mothers whose stories and moments feel like yours.",
      },
      {
        icon: Sprout,
        title: "Grow",
        text: "See how your wellbeing shifts over time.",
      },
    ],
  },
};

export function getValues(lang: Locale): ValuesContent {
  return VALUES[lang];
}
