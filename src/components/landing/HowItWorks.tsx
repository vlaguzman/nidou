import { getHowItWorks } from "@/data/howItWorks";
import { sectionIds } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { Reveal } from "./Reveal";

export function HowItWorks({ lang }: { lang: Locale }) {
  const howItWorks = getHowItWorks(lang);

  return (
    <section id={sectionIds.comoFunciona} className="bg-background py-18 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="text-center font-heading text-3xl text-foreground sm:text-4xl">
            {howItWorks.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-pretty leading-relaxed text-muted-foreground">
            {howItWorks.subtitle}
          </p>
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" aria-hidden />
          <ol className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {howItWorks.steps.map((step, i) => (
              <Reveal key={step} delay={i * 120} as="li" className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card font-heading text-lg text-foreground">
                  {i + 1}
                </div>
                <p className="mt-5 max-w-64 text-pretty leading-relaxed text-foreground/80">{step}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
