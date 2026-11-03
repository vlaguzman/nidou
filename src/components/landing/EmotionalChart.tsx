"use client";

import { useEffect, useRef, useState } from "react";
import { chart } from "@/data/wellbeing";
import { CHART, areaPath, buildPoints, smoothPath } from "@/lib/chart";

const points = buildPoints(chart.values);
const line = smoothPath(points);
const area = areaPath(points);
const last = points[points.length - 1];
const gridLines = [0.25, 0.5, 0.75].map(
  (g) => CHART.padY + (CHART.height - CHART.padY * 2) * g,
);

export function EmotionalChart() {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (typeof IntersectionObserver === "undefined" || reducedMotion) {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_24px_60px_-34px_rgba(46,54,61,0.3)]">
      <figcaption className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{chart.title}</span>
        <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs text-secondary-foreground/80">
          {chart.range}
        </span>
      </figcaption>

      <svg
        ref={ref}
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        className="h-auto w-full"
        role="img"
        aria-label={chart.ariaLabel}
      >
        <defs>
          <linearGradient id="emotional-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-sage)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-sage)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridLines.map((y) => (
          <line
            key={y}
            x1={CHART.padX}
            x2={CHART.width - CHART.padX}
            y1={y}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        ))}

        <path
          d={area}
          fill="url(#emotional-fill)"
          className="chart-fill"
          opacity={active ? 1 : 0}
        />

        <path
          d={line}
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="chart-line"
          pathLength="1"
          style={{ strokeDashoffset: active ? 0 : 1 }}
        />

        <circle
          cx={last.x}
          cy={last.y}
          r="6"
          fill="var(--color-terracotta)"
          className="chart-dot"
          opacity={active ? 1 : 0}
        />
      </svg>

      <div className="mt-3 flex justify-between px-1 text-[11px] text-muted-foreground">
        {chart.labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </figure>
  );
}
