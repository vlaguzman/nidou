import { sectionIds } from "./site";

export const hero = {
  headline: {
    lead: "La maternidad nos transforma.",
    accent: "La comunidad nos sostiene.",
  },
  primaryCta: { label: "Únete a la comunidad", href: `#${sectionIds.unete}` },
  secondaryCta: {
    label: "Descubre Nidou.",
    href: `#${sectionIds.comoFunciona}`,
  },
  image: {
    src: "/images/hero-mothers.webp",
    alt: "Madres compartiendo un momento tranquilo al aire libre",
  },
};
