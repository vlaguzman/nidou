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

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <CommunityIntro />
        <Testimonials />
        <ValuesSection />
        <WellbeingSection />
        <HowItWorks />
        <GallerySection />
        <EmotionalHistory />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
