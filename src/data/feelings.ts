export type Mood = {
  id: string;
  label: string;
  tone: "warm" | "calm";
  emoji: string;
  title: string;
  description: string;
  /** Optional external destination for the "join" button on the back face. */
  joinHref?: string;
};

export const moods: Mood[] = [
  {
    id: "agotada",
    label: "Agotada",
    tone: "warm",
    emoji: "🧘",
    title: "Presencia compartida",
    description:
      "Un espacio guiado para desconectar del ruido, recuperar energía y volver a ti. Una pausa consciente para recargar cuerpo y mente.",
  },
  {
    id: "sola",
    label: "Sola",
    tone: "warm",
    emoji: "☕",
    title: "¿Nos tomamos un café?",
    description:
      "No hay agenda. No hay presión. Solo conversaciones reales con mamás que probablemente sienten lo mismo que tú.",
  },
  {
    id: "saturada",
    label: "Saturada",
    tone: "warm",
    emoji: "🎨",
    title: "Cita con el artista",
    joinHref:
      "https://docs.google.com/forms/d/e/1FAIpQLSetgdHB1sEZDFp6GFSCGwF3d9zb43YxrrIwIEHou5MuWzPdWg/viewform?usp=header",
    description:
      "Un espacio para explorar tu creatividad, jugar con las manos y despejar la mente mientras haces algo solo para ti.",
  },
  {
    id: "conectada",
    label: "Conectada",
    tone: "calm",
    emoji: "✨",
    // The source repeats "Cita con el artista" here; distinct title chosen.
    title: "Creatividad en comunidad",
    description:
      "Estás en un buen momento para potenciar tu creatividad. Ven a crear, compartir e inspirarte con otras mujeres.",
  },
  {
    id: "esperanzada",
    label: "Esperanzada",
    tone: "calm",
    emoji: "🚀",
    title: "Emprendimiento 1.0",
    description:
      "Canalicemos esa energía en acción. Empecemos a construir esa idea que lleva tiempo esperando salir.",
  },
];

export const defaultMoodId = "conectada";

export const feelingCard = {
  eyebrow: "Tu espacio",
  question: "¿Cómo te sientes hoy?",
  insight: "Esta semana muchas madres han compartido sentimientos similares.",
  backEyebrow: "Para ti",
  join: "Me sumo al siguiente",
  back: "Volver",
};
