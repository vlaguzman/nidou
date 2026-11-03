export const sectionIds = {
  inicio: "inicio",
  comoFunciona: "como-funciona",
  comunidad: "comunidad",
  bienestar: "bienestar",
  historias: "historias",
  unete: "unete",
} as const;

export const siteMetadata = {
  title: "NIDOU — Maternidad vivida en comunidad",
  description:
    "NIDOU es un espacio donde conectar con madres que viven momentos parecidos al tuyo, compartir experiencias y descubrir cómo evoluciona tu bienestar emocional a lo largo del tiempo.",
};

export const navLinks = [
  { label: "Cómo funciona", href: `#${sectionIds.comoFunciona}` },
  { label: "La comunidad", href: `#${sectionIds.comunidad}` },
  { label: "Tu bienestar", href: `#${sectionIds.bienestar}` },
  { label: "Historias", href: `#${sectionIds.historias}` },
];

export const mobileMenu = {
  openLabel: "Abrir menú",
  closeLabel: "Cerrar menú",
  navLabel: "Menú móvil",
};

export const headerCta = { label: "Únete", href: `#${sectionIds.unete}` };

export const footer = {
  tagline:
    "Maternidad vivida en comunidad. Un espacio para sentirte acompañada y cuidar de tus emociones.",
  columns: [
    {
      title: "Comunidad",
      links: [
        { label: "Cómo funciona", href: `#${sectionIds.comoFunciona}` },
        { label: "Encuentros", href: `#${sectionIds.comunidad}` },
        { label: "Historias", href: `#${sectionIds.historias}` },
      ],
    },
    {
      title: "NIDOU",
      links: [
        // Placeholder: there is no "about" page yet.
        { label: "Sobre nosotras", href: "#" },
        { label: "Tu bienestar", href: `#${sectionIds.bienestar}` },
        { label: "Únete", href: `#${sectionIds.unete}` },
      ],
    },
  ],
  email: "hola@nidou.com",
  // Placeholder: replace with the real Instagram profile URL.
  instagramHref: "#",
  closing: "Hecho con calma.",
};
