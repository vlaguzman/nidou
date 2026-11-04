import type { Locale } from "@/i18n/config";

export type Testimonial = { quote: string; name: string; detail: string; collapsible?: boolean };

export type TestimonialsContent = {
  heading: string;
  expand: { more: string; less: string };
  items: Testimonial[];
};

const TESTIMONIALS: Record<Locale, TestimonialsContent> = {
  es: {
    heading: "Lo que cambia cuando te sientes acompañada",
    expand: { more: "Leer más", less: "Leer menos" },
    items: [
      {
        quote:
          "Mi cita con el artista que Adriana me ha enseñado me ha hecho darme cuenta de que sí es posible crear cosas lindas y artísticas mientras me regalo un espacio para mí. Es muy gratificante ver el resultado final y saber que Luca algún día lo tendrá como recuerdo del amor de su mamá. Gracias, Adri, por ayudarme a encontrar al artista que hay en mí y por compartir tu tiempo conmigo en esta aventura de la maternidad.",
        name: "Laura",
        detail: "Cita con el artista",
        collapsible: true,
      },
      {
        quote:
          "Vale la pena tomarse un espacio, no sabía que necesitaba tanto respirar profundo y con intención y reconocer de todo lo que estoy siendo capaz.",
        name: "Ana",
        detail: "Presencia compartida",
      },
      {
        quote: "Sentí que no estoy sola, me sentí acogida y escuchada.",
        name: "Annie",
        detail: "Presencia compartida",
      },
    ],
  },
  en: {
    heading: "What changes when you feel supported",
    expand: { more: "Read more", less: "Read less" },
    items: [
      {
        quote:
          "The date with the artist that Adriana taught me made me realize that it really is possible to create lovely, artistic things while giving myself some time. It's so rewarding to see the final result and to know that one day Luca will keep it as a memory of his mom's love. Thank you, Adri, for helping me find the artist inside me and for sharing your time with me on this adventure of motherhood.",
        name: "Laura",
        detail: "Date with the artist",
        collapsible: true,
      },
      {
        quote:
          "It's worth taking some time for yourself. I didn't know how much I needed to breathe deeply and with intention, and to recognize everything I'm capable of.",
        name: "Ana",
        detail: "Shared presence",
      },
      {
        quote: "I felt I wasn't alone. I felt welcomed and heard.",
        name: "Annie",
        detail: "Shared presence",
      },
    ],
  },
};

export function getTestimonials(lang: Locale): TestimonialsContent {
  return TESTIMONIALS[lang];
}
