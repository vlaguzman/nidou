import { notFound } from "next/navigation";
import { CommunityIntro } from "@/components/landing/CommunityIntro";
import { EmotionalHistory } from "@/components/landing/EmotionalHistory";
import { FinalCta } from "@/components/landing/FinalCta";
import { GallerySection } from "@/components/landing/GallerySection";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { Testimonials } from "@/components/landing/Testimonials";
import { ValuesSection } from "@/components/landing/ValuesSection";
import { WellbeingSection } from "@/components/landing/WellbeingSection";
import { hasLocale } from "@/i18n/config";

export default async function Page({ params }: Pick<PageProps<"/[lang]">, "params">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <SiteHeader lang={lang} />
      <main>
        <Hero lang={lang} />
        <CommunityIntro lang={lang} />
        <Testimonials lang={lang} />
        <ValuesSection lang={lang} />
        <WellbeingSection lang={lang} />
        <HowItWorks lang={lang} />
        <GallerySection lang={lang} />
        <EmotionalHistory lang={lang} />
        <FinalCta lang={lang} />
      </main>
      <SiteFooter lang={lang} />
    </>
  );
}
