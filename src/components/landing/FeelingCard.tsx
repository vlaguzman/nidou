"use client";

import { useEffect, useRef, useState } from "react";
import type { FeelingsContent } from "@/data/feelings";

const hiddenFace = "absolute inset-x-0 top-0";

const faceBase =
  "rounded-3xl border border-border/70 bg-card p-7 shadow-[0_24px_60px_-30px_rgba(46,54,61,0.35)] [backface-visibility:hidden]";

export function FeelingCard({ content }: { content: FeelingsContent }) {
  const { moods, defaultMoodId, card: feelingCard } = content;
  const [selectedId, setSelectedId] = useState(defaultMoodId);
  const [flipped, setFlipped] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasFlipped = useRef(false);

  // The face that held focus becomes inert on flip, so move focus explicitly.
  useEffect(() => {
    if (!hasFlipped.current) return;
    if (flipped) headingRef.current?.focus();
    else chipRefs.current[selectedId]?.focus();
  }, [flipped]);

  const active = moods.find((m) => m.id === selectedId) ?? moods[0];

  function handleSelect(id: string) {
    setSelectedId(id);
    hasFlipped.current = true;
    setFlipped(true);
  }

  return (
    <div className="w-full max-w-sm [perspective:1600px]">
      <div
        className={`relative w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0.15,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT */}
        {/* Only the visible face is in flow, so the card is as tall as that face; the hidden one is absolute and backface-hidden. */}
        <div data-face="front" inert={flipped} className={`${faceBase} ${flipped ? hiddenFace : ""}`}>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {feelingCard.eyebrow}
          </p>
          <h2 className="mt-3 font-heading text-2xl text-foreground">{feelingCard.question}</h2>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {moods.map((mood) => {
              const isActive = selectedId === mood.id;
              const activeTone =
                mood.tone === "calm"
                  ? "border-secondary bg-secondary text-secondary-foreground"
                  : "border-accent-text bg-accent-text text-accent-foreground";
              return (
                <button
                  key={mood.id}
                  ref={(el) => {
                    chipRefs.current[mood.id] = el;
                  }}
                  type="button"
                  onClick={() => handleSelect(mood.id)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                    isActive
                      ? activeTone
                      : "border-border bg-background text-foreground/70 hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {mood.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BACK */}
        <div
          data-face="back"
          inert={!flipped}
          className={`${faceBase} flex flex-col [transform:rotateY(180deg)] ${flipped ? "" : hiddenFace}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {feelingCard.backEyebrow} · {active.label}
            </p>
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xl ${
                active.tone === "calm" ? "bg-secondary/20" : "bg-accent/15"
              }`}
              aria-hidden
            >
              {active.emoji}
            </span>
          </div>

          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 text-balance font-heading text-2xl leading-tight text-foreground focus:outline-none"
          >
            {active.title}
          </h3>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            {active.description}
          </p>

          {/* Fades and unfolds with each flip, so the message appears with the back and disappears with it. */}
          <div
            data-insight
            data-state={flipped ? "open" : "closed"}
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0.15,0.2,1)] motion-reduce:transition-none ${
              flipped ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-muted/70 p-4">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" aria-hidden />
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{active.insight.text}</p>
                  {active.insight.source ? (
                    <p className="mt-1.5 text-xs text-muted-foreground/80">
                      {feelingCard.sourceLabel}: {active.insight.source}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <a
              href={active.joinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {feelingCard.join}
            </a>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span aria-hidden>←</span> {feelingCard.back}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
