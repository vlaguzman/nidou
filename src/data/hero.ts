import type { Locale } from "@/i18n/config";
import { COMMUNITY_FORM_HREF, sectionIds } from "./site";

export type HeroContent = {
  headline: { lead: string; accent: string };
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: { src: string; alt: string };
};

// Locale-neutral values are defined once; only text differs per locale.
const PRIMARY_HREF = COMMUNITY_FORM_HREF;
const SECONDARY_HREF = `#${sectionIds.comoFunciona}`;
const IMAGE_SRC = "/images/hero-mothers.webp";

const HERO: Record<Locale, HeroContent> = {
  es: {
    headline: {
      lead: "La maternidad nos transforma.",
      accent: "La comunidad nos sostiene.",
    },
    primaryCta: { label: "Únete a la comunidad", href: PRIMARY_HREF },
    secondaryCta: { label: "Descubre Nidou.", href: SECONDARY_HREF },
    image: {
      src: IMAGE_SRC,
      alt: "Madres compartiendo un momento tranquilo al aire libre",
    },
  },
  en: {
    headline: {
      lead: "Motherhood transforms us.",
      accent: "Community holds us.",
    },
    primaryCta: { label: "Join the community", href: PRIMARY_HREF },
    secondaryCta: { label: "Discover Nidou.", href: SECONDARY_HREF },
    image: {
      src: IMAGE_SRC,
      alt: "Mothers sharing a quiet moment outdoors",
    },
  },
};

export function getHero(lang: Locale): HeroContent {
  return HERO[lang];
}
