import Image from "next/image";
import { getCommunityIntro } from "@/data/communityIntro";
import type { Locale } from "@/i18n/config";
import { Reveal } from "./Reveal";

export function CommunityIntro({ lang }: { lang: Locale }) {
  const communityIntro = getCommunityIntro(lang);

  return (
    <section className="bg-secondary/10 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="text-balance font-heading text-3xl leading-tight text-foreground sm:text-4xl">
            <Image
              src={communityIntro.logo.src}
              alt={communityIntro.logo.alt}
              width={133}
              height={40}
              className="mr-3 inline-block h-10 w-auto align-middle"
            />
            {communityIntro.statement}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70">
            {communityIntro.supporting}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
