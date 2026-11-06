import { getFinalCta } from "@/data/finalCta";
import { sectionIds } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { Enso } from "./Enso";
import { FinalCtaForm } from "./FinalCtaForm";
import { Reveal } from "./Reveal";

export function FinalCta({ lang }: { lang: Locale }) {
  const finalCta = getFinalCta(lang);

  return (
    <section
      id={sectionIds.unete}
      className="relative overflow-hidden bg-secondary py-18 text-secondary-foreground sm:py-24"
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

        <FinalCtaForm form={finalCta.form} thanks={finalCta.thanks} whatsapp={finalCta.whatsapp} />
      </div>
    </section>
  );
}
