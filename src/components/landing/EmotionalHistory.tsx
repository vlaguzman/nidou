import { getEmotionalHistory } from "@/data/emotionalHistory";
import type { Locale } from "@/i18n/config";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

// Geometry shared between the badges (HTML) and the connecting line (SVG).
const CHART_H = 230;
// Badges are 36px on phones and 56px from `sm`; each is translated up by half its
// own size, so `centerFor` is the badge centre at every breakpoint.
const BADGE_HALF_MAX = 28;
const MAX_OFFSET = 150;
const centerFor = (level: number) => BADGE_HALF_MAX + ((4 - level) / 4) * MAX_OFFSET;
const xPercentOf = (i: number, count: number) => ((i + 0.5) / count) * 100;

export function EmotionalHistory({ lang }: { lang: Locale }) {
  const emotionalHistory = getEmotionalHistory(lang);
  const { moodScale, moodTimeline } = emotionalHistory;
  const [lead, detail] = emotionalHistory.paragraphs;
  const xPercent = (i: number) => xPercentOf(i, moodTimeline.length);
  const linePoints = moodTimeline
    .map((p, i) => `${(xPercent(i) * 10).toFixed(1)},${centerFor(p.level).toFixed(1)}`)
    .join(" ");

  return (
    <section className="bg-muted/40 py-18 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow>{emotionalHistory.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-balance font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            {emotionalHistory.heading}
          </h2>
          <p className="mt-6 border-l-2 border-accent pl-4 text-pretty font-heading text-xl italic leading-relaxed text-foreground/90">
            {emotionalHistory.quote}
          </p>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-foreground/75">{lead}</p>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{detail}</p>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-[0_24px_60px_-34px_rgba(46,54,61,0.3)] sm:p-7">
            <div className="mb-2">
              <span className="block text-sm font-medium text-foreground">
                {emotionalHistory.card.title}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {emotionalHistory.card.subtitle}
              </span>
            </div>

            <div className="relative mt-6" style={{ height: CHART_H }}>
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox={`0 0 1000 ${CHART_H}`}
                preserveAspectRatio="none"
                aria-hidden
              >
                <polyline
                  points={linePoints}
                  fill="none"
                  className="stroke-border"
                  strokeWidth={1.5}
                  strokeDasharray="2 7"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {moodTimeline.map(({ date, mood, level, icon: Icon, color }, i) => (
                <div
                  key={date}
                  className="absolute flex -translate-x-1/2 -translate-y-4.5 flex-col sm:-translate-y-7 items-center"
                  style={{ left: `${xPercent(i)}%`, top: centerFor(level) }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background shadow-[0_10px_24px_-16px_rgba(46,54,61,0.4)] sm:h-14 sm:w-14"
                  >
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="mt-2 text-[11px] leading-none text-muted-foreground">{date}</span>
                  <span className="sr-only">{mood}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-5">
              {moodScale.map(({ mood, icon: Icon, color }) => (
                <span key={mood} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.75} aria-hidden />
                  {mood}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
