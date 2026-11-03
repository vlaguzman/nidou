import { ArrowDown } from "lucide-react";
import { sectionIds } from "@/data/site";
import { flow, wellbeing } from "@/data/wellbeing";
import { EmotionalChart } from "./EmotionalChart";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

export function WellbeingSection() {
  const [lead, detail] = wellbeing.paragraphs;

  return (
    <section id={sectionIds.bienestar} className="bg-muted/40 py-18 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal className="order-2 lg:order-1">
          <EmotionalChart />

          <div className="mt-8 rounded-3xl border border-border/70 bg-card/60 p-6">
            <ol className="space-y-1">
              {flow.map((step, i) => (
                <li key={step}>
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-sm font-medium text-secondary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{step}</span>
                  </div>
                  {i < flow.length - 1 && (
                    <ArrowDown className="my-1 ml-3.5 h-4 w-4 text-secondary/60" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <Eyebrow>{wellbeing.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-balance font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            {wellbeing.heading}
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-foreground/75">{lead}</p>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{detail}</p>
        </Reveal>
      </div>
    </section>
  );
}
