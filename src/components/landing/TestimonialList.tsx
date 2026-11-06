"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import type { TestimonialsContent } from "@/data/testimonials";
import { Reveal } from "./Reveal";

type Props = Pick<TestimonialsContent, "items" | "expand" | "carousel">;

const AUTOPLAY_MS = 6000;

const control =
  "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-foreground/5";

export function TestimonialList({ items, expand, carousel }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const trackRef = useRef<HTMLDivElement>(null);
  // `paused` is the reader's choice; hover and focus each hold it temporarily.
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const held = hovered || focused;
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setPaused(true);
    }
  }, []);

  // Scrolls by one card, wrapping around at either end.
  const step = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      const card = track?.firstElementChild as HTMLElement | null;
      if (!track || !card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const max = track.scrollWidth - track.clientWidth;
      let left = track.scrollLeft + dir * (card.offsetWidth + gap);
      if (dir === 1 && track.scrollLeft >= max - 1) left = 0;
      if (dir === -1 && track.scrollLeft <= 1) left = max;
      track.scrollTo?.({ left, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion],
  );

  useEffect(() => {
    if (paused || held) return;
    const id = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, held, step]);

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  }

  // Only a real mouse hovers: touch fires an enter with no matching leave.
  function handleHover(e: PointerEvent<HTMLDivElement>, value: boolean) {
    if (e.pointerType === "mouse") setHovered(value);
  }

  return (
    <Reveal className="mt-10">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={carousel.label}
        onPointerEnter={(e) => handleHover(e, true)}
        onPointerLeave={(e) => handleHover(e, false)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
      >
        <div
          ref={trackRef}
          className="testimonial-track flex snap-x snap-mandatory gap-6 overflow-x-auto"
        >
          {items.map((t, i) => {
            const quoteId = `testimonial-quote-${i}`;
            const isOpen = !!expanded[t.name];
            return (
              <article
                key={t.name}
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${items.length}`}
                className="flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border border-border/70 bg-card p-8 md:w-[calc((100%-3rem)/3)]"
              >
                <span className="font-heading text-5xl leading-none text-secondary/50" aria-hidden>
                  &ldquo;
                </span>
                <p
                  id={quoteId}
                  className={`mt-2 text-pretty text-lg leading-relaxed text-foreground/85 ${
                    t.collapsible && !isOpen ? "line-clamp-5" : ""
                  }`}
                >
                  {t.quote}
                </p>
                {t.collapsible && (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={quoteId}
                    onClick={() => setExpanded((prev) => ({ ...prev, [t.name]: !isOpen }))}
                    className="mt-4 self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {isOpen ? expand.less : expand.more}
                  </button>
                )}
                <div className="flex-1" />
                <div className="mt-7 border-t border-border pt-5">
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.detail}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button type="button" aria-label={carousel.previous} onClick={() => step(-1)} className={control}>
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            aria-label={paused ? carousel.play : carousel.pause}
            onClick={() => setPaused((p) => !p)}
            className={control}
          >
            <span aria-hidden className="text-xs">{paused ? "▶" : "❚❚"}</span>
          </button>
          <button type="button" aria-label={carousel.next} onClick={() => step(1)} className={control}>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </Reveal>
  );
}
