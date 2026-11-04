import { sectionIds } from "@/data/site";
import { getTestimonials } from "@/data/testimonials";
import type { Locale } from "@/i18n/config";
import { Reveal } from "./Reveal";
import { TestimonialList } from "./TestimonialList";

export function Testimonials({ lang }: { lang: Locale }) {
  const testimonials = getTestimonials(lang);

  return (
    <section id={sectionIds.historias} className="bg-background py-18 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance text-center font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            {testimonials.heading}
          </h2>
        </Reveal>

        <TestimonialList items={testimonials.items} expand={testimonials.expand} />
      </div>
    </section>
  );
}
