import type { Locale } from "@/i18n/config";

// Section anchors are locale-neutral: both languages share the same Spanish ids.
export const sectionIds = {
  inicio: "inicio",
  comoFunciona: "como-funciona",
  comunidad: "comunidad",
  bienestar: "bienestar",
  historias: "historias",
  unete: "unete",
} as const;

type Link = { label: string; href: string };

export type SiteContent = {
  metadata: { title: string; description: string };
  header: { homeLabel: string; navLabel: string };
  navLinks: Link[];
  mobileMenu: { openLabel: string; closeLabel: string; navLabel: string };
  headerCta: Link;
  languageLabel: string;
  footer: {
    tagline: string;
    columns: { title: string; links: Link[] }[];
    email: string;
    emailLabel: string;
    instagramHref: string;
    instagramLabel: string;
    closing: string;
  };
};

const anchor = (label: string, id: string): Link => ({ label, href: `#${id}` });

// Locale-neutral values are defined once; only text differs per locale.
const EMAIL = "hola@nidou.com";
export const INSTAGRAM_HREF = "https://www.instagram.com/nidou.family";
// Placeholder: there is no "about" page yet.
const ABOUT_HREF = "#";

const SITE: Record<Locale, SiteContent> = {
  es: {
    metadata: {
      title: "NIDOU — Maternidad vivida en comunidad",
      description:
        "NIDOU es un espacio donde conectar con madres que viven momentos parecidos al tuyo, compartir experiencias y descubrir cómo evoluciona tu bienestar emocional a lo largo del tiempo.",
    },
    header: { homeLabel: "NIDOU, inicio", navLabel: "Principal" },
    navLinks: [
      anchor("Cómo funciona", sectionIds.comoFunciona),
      anchor("La comunidad", sectionIds.comunidad),
      anchor("Tu bienestar", sectionIds.bienestar),
      anchor("Historias", sectionIds.historias),
    ],
    mobileMenu: { openLabel: "Abrir menú", closeLabel: "Cerrar menú", navLabel: "Menú móvil" },
    headerCta: anchor("Únete", sectionIds.unete),
    languageLabel: "Idioma",
    footer: {
      tagline:
        "Maternidad vivida en comunidad. Un espacio para sentirte acompañada y cuidar de tus emociones.",
      columns: [
        {
          title: "Comunidad",
          links: [
            anchor("Cómo funciona", sectionIds.comoFunciona),
            anchor("Encuentros", sectionIds.comunidad),
            anchor("Historias", sectionIds.historias),
          ],
        },
        {
          title: "NIDOU",
          links: [
            { label: "Sobre nosotras", href: ABOUT_HREF },
            anchor("Tu bienestar", sectionIds.bienestar),
            anchor("Únete", sectionIds.unete),
          ],
        },
      ],
      email: EMAIL,
      emailLabel: "Escríbenos un correo",
      instagramHref: INSTAGRAM_HREF,
      instagramLabel: "Síguenos en Instagram",
      closing: "Hecho con calma.",
    },
  },
  en: {
    metadata: {
      title: "NIDOU — Motherhood, lived together",
      description:
        "NIDOU is a space to connect with mothers going through moments like yours, share experiences and see how your emotional wellbeing changes over time.",
    },
    header: { homeLabel: "NIDOU, home", navLabel: "Main" },
    navLinks: [
      anchor("How it works", sectionIds.comoFunciona),
      anchor("The community", sectionIds.comunidad),
      anchor("Your wellbeing", sectionIds.bienestar),
      anchor("Stories", sectionIds.historias),
    ],
    mobileMenu: { openLabel: "Open menu", closeLabel: "Close menu", navLabel: "Mobile menu" },
    headerCta: anchor("Join", sectionIds.unete),
    languageLabel: "Language",
    footer: {
      tagline:
        "Motherhood, lived together. A space to feel supported and to look after your emotions.",
      columns: [
        {
          title: "Community",
          links: [
            anchor("How it works", sectionIds.comoFunciona),
            anchor("Gatherings", sectionIds.comunidad),
            anchor("Stories", sectionIds.historias),
          ],
        },
        {
          title: "NIDOU",
          links: [
            { label: "About us", href: ABOUT_HREF },
            anchor("Your wellbeing", sectionIds.bienestar),
            anchor("Join", sectionIds.unete),
          ],
        },
      ],
      email: EMAIL,
      emailLabel: "Send us an email",
      instagramHref: INSTAGRAM_HREF,
      instagramLabel: "Follow us on Instagram",
      closing: "Made with calm.",
    },
  },
};

export function getSite(lang: Locale): SiteContent {
  return SITE[lang];
}
