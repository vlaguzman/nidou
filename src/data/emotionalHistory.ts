import { Cloud, CloudLightning, CloudRain, CloudSun, Sun } from "lucide-react";

// Level 0 = hardest day (stormy), level 4 = brightest day (sunny).
export const moodScale = [
  { level: 0, mood: "Tormentoso", icon: CloudLightning, color: "text-foreground" },
  { level: 1, mood: "Lluvioso", icon: CloudRain, color: "text-foreground/70" },
  { level: 2, mood: "Nublado", icon: Cloud, color: "text-muted-foreground" },
  { level: 3, mood: "Despejando", icon: CloudSun, color: "text-secondary-text" },
  { level: 4, mood: "Luminoso", icon: Sun, color: "text-accent-text" },
];

const logged = [
  { date: "2 may", level: 0 },
  { date: "9 may", level: 1 },
  { date: "16 may", level: 2 },
  { date: "23 may", level: 3 },
  { date: "30 may", level: 4 },
  { date: "6 jun", level: 1 },
];

export const moodTimeline = logged.map(({ date, level }) => ({
  date,
  ...moodScale[level],
}));

export const emotionalHistory = {
  eyebrow: "Autoconocimiento",
  heading: "Tu historia emocional",
  quote: "No se trata de siempre estar bien, sino de darte cuenta cómo estás.",
  paragraphs: [
    "Con el tiempo, cada madre puede descubrir patrones, reconocer los momentos más difíciles y valorar qué experiencias le ayudan a sentirse mejor.",
    "No es un análisis clínico. Es una forma serena de conocerte mejor y de recordarte, en los días difíciles, todo el camino que ya has recorrido.",
  ],
  card: {
    title: "Tu registro emocional",
    subtitle: "Una mirada a tu camino, sin presión.",
  },
};
