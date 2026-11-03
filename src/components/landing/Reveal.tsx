"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Transition delay in milliseconds. */
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "span";
};

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ children, className = "", delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Content is visible on the server / without JS; the hidden state is only
  // applied once the client has mounted and can reveal it again.
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    // Already in (or above) the viewport on mount: leave it visible so there is
    // no hide-then-show flash. Only content below the fold is armed.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Component = as as ElementType;

  return (
    <Component
      ref={ref}
      className={`${armed ? "reveal" : ""} ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
