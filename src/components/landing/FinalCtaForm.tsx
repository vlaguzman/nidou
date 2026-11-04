"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FinalCtaContent } from "@/data/finalCta";
import { Reveal } from "./Reveal";

type Props = Pick<FinalCtaContent, "form" | "thanks">;

export function FinalCtaForm({ form, thanks }: Props) {
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
        {sent ? thanks : null}
      </p>
      {!sent && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="cta-email" className="sr-only">
            {form.emailLabel}
          </label>
          <input
            id="cta-email"
            name="email"
            autoComplete="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={form.emailPlaceholder}
            className="h-12 flex-1 rounded-full border border-background/40 bg-background/90 px-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-background"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-primary px-7 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {form.submitLabel}
          </button>
        </form>
      )}
    </Reveal>
  );
}
