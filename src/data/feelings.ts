import type { Locale } from "@/i18n/config";
import { COMMUNITY_FORM_HREF } from "./site";

export type Mood = {
  id: string;
  label: string;
  tone: "warm" | "calm";
  emoji: string;
  title: string;
  description: string;
  /** External destination for the "join" button on the back face. */
  joinHref: string;
  /** Per-mood stat or note shown on the back face; `source` only for sourced stats. */
  insight: { text: string; source?: string };
};

export type FeelingsContent = {
  moods: Mood[];
  defaultMoodId: string;
  card: {
    eyebrow: string;
    question: string;
    sourceLabel: string;
    backEyebrow: string;
    join: string;
    back: string;
  };
};

// Locale-neutral: ids, tones, emojis and the signup form links are defined once.
// The forms are in Spanish and serve both locales. Moods without their own event
// form link to the community form.
const ARTIST_FORM_HREF =
  "https://docs.google.com/forms/d/e/1FAIpQLSetgdHB1sEZDFp6GFSCGwF3d9zb43YxrrIwIEHou5MuWzPdWg/viewform?usp=header";

// Insight stats are static, sourced data (NCT 2026; The Lancet Public Health 2023).
const MOODS: {
  id: string;
  tone: Mood["tone"];
  emoji: string;
  joinHref?: string;
  source?: string;
}[] = [
  { id: "agotada", tone: "warm", emoji: "🧘", source: "NCT, 2026" },
  { id: "sola", tone: "warm", emoji: "☕", source: "NCT, 2026" },
  { id: "saturada", tone: "warm", emoji: "🎨", joinHref: ARTIST_FORM_HREF, source: "The Lancet Public Health, 2023" },
  { id: "conectada", tone: "calm", emoji: "✨" },
  { id: "esperanzada", tone: "calm", emoji: "🚀" },
];

const DEFAULT_MOOD_ID = "conectada";

type MoodText = { label: string; title: string; description: string; insight: string };

const TEXT: Record<Locale, { moods: Record<string, MoodText>; card: FeelingsContent["card"] }> = {
  es: {
    moods: {
      agotada: {
        label: "Agotada",
        title: "Presencia compartida",
        description:
          "Un espacio guiado para desconectar del ruido, recuperar energía y volver a ti. Una pausa consciente para recargar cuerpo y mente.",
        insight:
          "En Reino Unido, cerca de 1 de cada 8 madres y padres dijo sentirse solo siempre después de tener un bebé. No tienes que cargar con todo sola.",
      },
      sola: {
        label: "Sola",
        title: "¿Nos tomamos un café?",
        description:
          "No hay agenda. No hay presión. Solo conversaciones reales con mamás que probablemente sienten lo mismo que tú.",
        insight:
          "En Reino Unido, el 62% de las madres y padres se sintió solo o aislado al menos parte del tiempo después de tener un bebé.",
      },
      saturada: {
        label: "Saturada",
        title: "Cita con el artista",
        description:
          "Un espacio para explorar tu creatividad, jugar con las manos y despejar la mente mientras haces algo solo para ti.",
        insight:
          "Cerca de 1 de cada 5 madres migrantes vive ansiedad durante el embarazo o el primer año.",
      },
      conectada: {
        label: "Conectada",
        // The source repeats "Cita con el artista" here; distinct title chosen.
        title: "Creatividad en comunidad",
        description:
          "Estás en un buen momento para potenciar tu creatividad. Ven a crear, compartir e inspirarte con otras mujeres.",
        insight:
          "Esa conexión también sostiene a otras. Compartirla suma.",
      },
      esperanzada: {
        label: "Esperanzada",
        title: "Emprendimiento 1.0",
        description:
          "Canalicemos esa energía en acción. Empecemos a construir esa idea que lleva tiempo esperando salir.",
        insight:
          "Esa energía contagia. Muchas madres encuentran su impulso en grupo.",
      },
    },
    card: {
      eyebrow: "Tu espacio",
      question: "¿Cómo te sientes hoy?",
      sourceLabel: "Fuente",
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
        insight:
          "In the UK, nearly 1 in 8 mothers and fathers said they always felt lonely after having a baby. You don't have to carry it all alone.",
      },
      sola: {
        label: "Lonely",
        title: "Want to grab a coffee?",
        description:
          "No agenda. No pressure. Just real conversations with mothers who probably feel the way you do.",
        insight:
          "In the UK, 62% of mothers and fathers felt lonely or isolated at least some of the time after having a baby.",
      },
      saturada: {
        label: "Overwhelmed",
        title: "Date with the artist",
        description:
          "A space to get creative, play with your hands and clear your head while you make something just for you.",
        insight:
          "Around 1 in 5 migrant mothers experience anxiety during pregnancy or the first year after birth.",
      },
      conectada: {
        label: "Connected",
        title: "Creativity in community",
        description:
          "You're in a good place to dive into your creativity. Come make things, share and get inspired alongside other women.",
        insight:
          "That connection holds other mothers up too. Sharing it adds up.",
      },
      esperanzada: {
        label: "Hopeful",
        title: "Entrepreneurship 1.0",
        description:
          "Let's turn that energy into action and start building the idea that's been waiting to come out.",
        insight:
          "That energy is contagious. Many mothers find their drive in a group.",
      },
    },
    card: {
      eyebrow: "Your space",
      question: "How are you feeling today?",
      sourceLabel: "Source",
      backEyebrow: "For you",
      join: "Count me in for the next one",
      back: "Back",
    },
  },
};

function build(lang: Locale): FeelingsContent {
  const { moods, card } = TEXT[lang];
  return {
    moods: MOODS.map(({ id, tone, emoji, joinHref, source }) => {
      const { insight, ...text } = moods[id];
      return {
        id,
        tone,
        emoji,
        ...text,
        insight: { text: insight, ...(source ? { source } : {}) },
        joinHref: joinHref ?? COMMUNITY_FORM_HREF,
      };
    }),
    defaultMoodId: DEFAULT_MOOD_ID,
    card,
  };
}

const FEELINGS: Record<Locale, FeelingsContent> = { es: build("es"), en: build("en") };

export function getFeelings(lang: Locale): FeelingsContent {
  return FEELINGS[lang];
}
