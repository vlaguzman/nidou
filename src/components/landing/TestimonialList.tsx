"use client";

import { useState } from "react";
import type { TestimonialsContent } from "@/data/testimonials";
import { Reveal } from "./Reveal";

type Props = Pick<TestimonialsContent, "items" | "expand">;

export function TestimonialList({ items, expand }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {items.map((t, i) => {
        const quoteId = `testimonial-quote-${i}`;
        const isOpen = !!expanded[t.name];
        return (
          <Reveal
            key={t.name}
            delay={i * 140}
            as="article"
            className="flex flex-col rounded-3xl border border-border/70 bg-card p-8"
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
          </Reveal>
        );
      })}
    </div>
  );
}
