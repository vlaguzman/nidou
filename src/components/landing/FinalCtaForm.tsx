"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FinalCtaContent } from "@/data/finalCta";
import { whatsappHref } from "@/lib/whatsapp";
import { Reveal } from "./Reveal";

type Props = Pick<FinalCtaContent, "form" | "thanks" | "whatsapp">;

export function FinalCtaForm({ form, thanks, whatsapp }: Props) {
  const [email, setEmail] = useState("");
  // The WhatsApp link once submitted; doubles as the "sent" state.
  const [sentHref, setSentHref] = useState<string | null>(null);
  const sent = sentHref !== null;
  const statusRef = useRef<HTMLParagraphElement>(null);

  // The form unmounts on submit, so hand focus to the confirmation message.
  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  // No backend: submitting opens WhatsApp with the email in a prefilled message.
  // Opened synchronously so it keeps the user gesture and is not popup-blocked.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!address) return;
    const href = whatsappHref(whatsapp.phone, whatsapp.message.replace("{email}", () => address));
    window.open(href, "_blank", "noopener,noreferrer");
    setSentHref(href);
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
      {sentHref && (
        <a
          href={sentHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm underline underline-offset-4"
        >
          {whatsapp.fallbackLabel}
        </a>
      )}
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
            // Keeps password managers from injecting icons, which breaks hydration.
            data-lpignore="true"
            data-1p-ignore
            data-bwignore
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
