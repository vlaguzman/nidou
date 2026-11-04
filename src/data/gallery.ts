import type { Locale } from "@/i18n/config";

export type GalleryPhoto = {
  src: string;
  alt: string;
  layout?: "tall";
};

export type GalleryContent = {
  eyebrow: string;
  heading: string;
  description: string;
  photos: GalleryPhoto[];
};

// Sources and layout are locale-neutral; only the alt text is translated.
const PHOTOS: { src: string; layout?: "tall"; alt: Record<Locale, string> }[] = [
  {
    src: "/images/gallery-conversation.webp",
    layout: "tall",
    alt: { es: "Dos madres conversando con calma en un sofá", en: "Two mothers chatting calmly on a sofa" },
  },
  {
    src: "/images/gallery-walk.webp",
    alt: { es: "Madres paseando juntas por un parque", en: "Mothers walking together through a park" },
  },
  {
    src: "/images/gallery-cafe.webp",
    alt: { es: "Grupo de madres compartiendo un café", en: "A group of mothers sharing a coffee" },
  },
  {
    src: "/images/gallery-workshop.webp",
    alt: { es: "Círculo íntimo de madres en un taller", en: "An intimate circle of mothers at a workshop" },
  },
  {
    src: "/images/gallery-laughter.webp",
    alt: { es: "Dos madres riendo juntas al aire libre", en: "Two mothers laughing together outdoors" },
  },
  {
    src: "/images/gallery-quiet.webp",
    layout: "tall",
    alt: {
      es: "Madre disfrutando de un momento tranquilo junto a la ventana",
      en: "A mother enjoying a quiet moment by the window",
    },
  },
  {
    src: "/images/gallery-park.webp",
    alt: {
      es: "Madres y bebés descansando en una manta en el parque",
      en: "Mothers and babies resting on a blanket in the park",
    },
  },
];

const photosFor = (lang: Locale): GalleryPhoto[] =>
  PHOTOS.map(({ src, layout, alt }) => ({ src, alt: alt[lang], ...(layout ? { layout } : {}) }));

const GALLERY: Record<Locale, GalleryContent> = {
  es: {
    eyebrow: "Vínculos reales",
    heading: "No reunimos madres. Creamos vínculos.",
    description:
      "Cada encuentro comienza con una conversación y puede convertirse en una red de apoyo que permanece.",
    photos: photosFor("es"),
  },
  en: {
    eyebrow: "Real bonds",
    heading: "We don't just gather mothers. We build bonds.",
    description:
      "Every gathering starts with a conversation and can grow into a network of support that stays.",
    photos: photosFor("en"),
  },
};

export function getGallery(lang: Locale): GalleryContent {
  return GALLERY[lang];
}
