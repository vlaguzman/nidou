import type { Locale } from "@/i18n/config";

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

export type FeelingsContent = {
  moods: Mood[];
  defaultMoodId: string;
  card: {
    eyebrow: string;
    question: string;
    insight: string;
    backEyebrow: string;
    join: string;
    back: string;
  };
};

// Locale-neutral: ids, tones, emojis and the signup form link are defined once.
// The form itself is in Spanish and serves both locales.
const JOIN_FORM_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLSetgdHB1sEZDFp6GFSCGwF3d9zb43YxrrIwIEHou5MuWzPdWg/viewform?usp=header";

const MOODS: { id: string; tone: Mood["tone"]; emoji: string; joinHref?: string }[] = [
  { id: "agotada", tone: "warm", emoji: "🧘" },
  { id: "sola", tone: "warm", emoji: "☕" },
  { id: "saturada", tone: "warm", emoji: "🎨", joinHref: JOIN_FORM_HREF },
  { id: "conectada", tone: "calm", emoji: "✨" },
  { id: "esperanzada", tone: "calm", emoji: "🚀" },
];

const DEFAULT_MOOD_ID = "conectada";

type MoodText = { label: string; title: string; description: string };

const TEXT: Record<Locale, { moods: Record<string, MoodText>; card: FeelingsContent["card"] }> = {
  es: {
    moods: {
      agotada: {
        label: "Agotada",
        title: "Presencia compartida",
        description:
          "Un espacio guiado para desconectar del ruido, recuperar energía y volver a ti. Una pausa consciente para recargar cuerpo y mente.",
      },
      sola: {
        label: "Sola",
        title: "¿Nos tomamos un café?",
        description:
          "No hay agenda. No hay presión. Solo conversaciones reales con mamás que probablemente sienten lo mismo que tú.",
      },
      saturada: {
        label: "Saturada",
        title: "Cita con el artista",
        description:
          "Un espacio para explorar tu creatividad, jugar con las manos y despejar la mente mientras haces algo solo para ti.",
      },
      conectada: {
        label: "Conectada",
        // The source repeats "Cita con el artista" here; distinct title chosen.
        title: "Creatividad en comunidad",
        description:
          "Estás en un buen momento para potenciar tu creatividad. Ven a crear, compartir e inspirarte con otras mujeres.",
      },
      esperanzada: {
        label: "Esperanzada",
        title: "Emprendimiento 1.0",
        description:
          "Canalicemos esa energía en acción. Empecemos a construir esa idea que lleva tiempo esperando salir.",
      },
    },
    card: {
      eyebrow: "Tu espacio",
      question: "¿Cómo te sientes hoy?",
      insight: "Esta semana muchas madres han compartido sentimientos similares.",
      backEyebrow: "Para ti",
      join: "Me sumo al siguiente",
      back: "Volver",
    },
  },
  en: {
    moods: {
      agotada: {
        label: "Exhausted",
        title: "Shared presence",
        description:
          "A guided space to turn down the noise, get your energy back and come home to yourself. A mindful pause to recharge body and mind.",
      },
      sola: {
        label: "Lonely",
        title: "Want to grab a coffee?",
        description:
          "No agenda. No pressure. Just real conversations with mothers who probably feel the way you do.",
      },
      saturada: {
        label: "Overwhelmed",
        title: "Date with the artist",
        description:
          "A space to get creative, play with your hands and clear your head while you make something just for you.",
      },
      conectada: {
        label: "Connected",
        title: "Creativity in community",
        description:
          "You're in a good place to dive into your creativity. Come make things, share and get inspired alongside other women.",
      },
      esperanzada: {
        label: "Hopeful",
        title: "Entrepreneurship 1.0",
        description:
          "Let's turn that energy into action and start building the idea that's been waiting to come out.",
      },
    },
    card: {
      eyebrow: "Your space",
      question: "How are you feeling today?",
      insight: "This week, many mothers have shared similar feelings.",
      backEyebrow: "For you",
      join: "Count me in for the next one",
      back: "Back",
    },
  },
};

function build(lang: Locale): FeelingsContent {
  const { moods, card } = TEXT[lang];
  return {
    moods: MOODS.map(({ id, tone, emoji, joinHref }) => ({
      id,
      tone,
      emoji,
      ...moods[id],
      ...(joinHref ? { joinHref } : {}),
    })),
    defaultMoodId: DEFAULT_MOOD_ID,
    card,
  };
}

const FEELINGS: Record<Locale, FeelingsContent> = { es: build("es"), en: build("en") };

export function getFeelings(lang: Locale): FeelingsContent {
  return FEELINGS[lang];
}
