import { values, valuesHeading } from "@/data/values";
import { Reveal } from "./Reveal";

export function ValuesSection() {
  return (
    <section className="bg-background py-18 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-center font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            {valuesHeading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 sm:grid-cols-3 sm:gap-10">
          {values.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 140} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="mt-6 font-heading text-2xl text-foreground">{title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-pretty leading-relaxed text-muted-foreground">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
