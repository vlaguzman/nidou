import { sectionIds } from "./site";

export const hero = {
  eyebrow: "Maternidad vivida en comunidad",
  headline: {
    lead: "La maternidad cambia todo.",
    accent: "Y es mejor vivirla acompañada.",
  },
  description:
    "NIDOU es un espacio donde conectar con madres que viven momentos parecidos al tuyo, compartir experiencias y descubrir cómo evoluciona tu bienestar emocional a lo largo del tiempo.",
  primaryCta: { label: "Únete a la comunidad", href: `#${sectionIds.unete}` },
  secondaryCta: {
    label: "Descubre cómo funciona",
    href: `#${sectionIds.comoFunciona}`,
  },
  image: {
    src: "/images/hero-mothers.webp",
    alt: "Madres compartiendo un momento tranquilo al aire libre",
  },
};
