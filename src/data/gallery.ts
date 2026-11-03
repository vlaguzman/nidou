export type GalleryPhoto = {
  src: string;
  alt: string;
  layout?: "tall";
};

export const gallery = {
  eyebrow: "Vínculos reales",
  heading: "No reunimos madres. Creamos vínculos.",
  description:
    "Cada encuentro comienza con una conversación y puede convertirse en una red de apoyo que permanece.",
  photos: [
    { src: "/images/gallery-conversation.webp", alt: "Dos madres conversando con calma en un sofá", layout: "tall" },
    { src: "/images/gallery-walk.webp", alt: "Madres paseando juntas por un parque" },
    { src: "/images/gallery-cafe.webp", alt: "Grupo de madres compartiendo un café" },
    { src: "/images/gallery-workshop.webp", alt: "Círculo íntimo de madres en un taller" },
    { src: "/images/gallery-laughter.webp", alt: "Dos madres riendo juntas al aire libre" },
    { src: "/images/gallery-quiet.webp", alt: "Madre disfrutando de un momento tranquilo junto a la ventana", layout: "tall" },
    { src: "/images/gallery-park.webp", alt: "Madres y bebés descansando en una manta en el parque" },
  ] as GalleryPhoto[],
};
