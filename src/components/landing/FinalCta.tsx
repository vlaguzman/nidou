"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { finalCta } from "@/data/finalCta";
import { sectionIds } from "@/data/site";
import { Enso } from "./Enso";
import { Reveal } from "./Reveal";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  // The form unmounts on submit, so hand focus to the confirmation message.
  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  // No backend yet: submitting only flips local state.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) setSent(true);
  }

  return (
    <section
      id={sectionIds.unete}
      className="relative overflow-hidden bg-secondary py-28 text-secondary-foreground sm:py-36"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-20 sm:h-96 sm:w-96"
        aria-hidden
      >
        <Enso animate={false} />
      </div>

      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="text-balance font-heading text-4xl leading-tight sm:text-5xl">
            {finalCta.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-pretty text-lg leading-relaxed text-secondary-foreground">
            {finalCta.description}
          </p>
        </Reveal>

        <Reveal delay={150}>
          {/* Rendered before submit so screen readers register the live region, then filled on submit. */}
          <p
            ref={statusRef}
            role="status"
            tabIndex={-1}
            className={
              sent
                ? "mx-auto mt-10 max-w-sm rounded-2xl bg-background/70 px-6 py-5 text-foreground focus:outline-none"
                : undefined
            }
          >
            {sent ? finalCta.thanks : null}
          </p>
          {!sent && (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="cta-email" className="sr-only">
                {finalCta.form.emailLabel}
              </label>
              <input
                id="cta-email"
                name="email"
                autoComplete="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={finalCta.form.emailPlaceholder}
                className="h-12 flex-1 rounded-full border border-background/40 bg-background/90 px-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-primary px-7 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {finalCta.form.submitLabel}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
