import { sectionIds } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { Reveal } from "./Reveal";

export function Testimonials() {
  return (
    <section id={sectionIds.historias} className="bg-background py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-center font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            {testimonials.heading}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.items.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 140}
              as="article"
              className="flex flex-col rounded-3xl border border-border/70 bg-card p-8"
            >
              <span className="font-heading text-5xl leading-none text-secondary/50" aria-hidden>
                &ldquo;
              </span>
              <p className="mt-2 flex-1 text-pretty text-lg leading-relaxed text-foreground/85">
                {t.quote}
              </p>
              <div className="mt-7 border-t border-border pt-5">
                <p className="font-medium text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
