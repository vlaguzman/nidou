import Image from "next/image";
import { hero } from "@/data/hero";
import { sectionIds } from "@/data/site";
import { FeelingCard } from "./FeelingCard";

export function Hero() {
  return (
    <section
      id={sectionIds.inicio}
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-24 pb-16"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="animate-slow-pan object-cover motion-reduce:animate-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-xl">
          <h1 className="text-balance font-heading text-5xl leading-[1.05] text-foreground sm:text-6xl">
            {hero.headline.lead}
            <span className="mt-2 block text-secondary-text">{hero.headline.accent}</span>
          </h1>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={hero.primaryCta.href}
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-base text-foreground transition-colors hover:bg-foreground/5"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <FeelingCard />
        </div>
      </div>
    </section>
  );
}
