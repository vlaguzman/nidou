import { getSite, sectionIds } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { SiteHeaderBar } from "./SiteHeaderBar";

export function SiteHeader({ lang }: { lang: Locale }) {
  const { header, navLinks, mobileMenu, headerCta, languageLabel } = getSite(lang);

  return (
    <SiteHeaderBar
      lang={lang}
      homeHref={`#${sectionIds.inicio}`}
      content={{ header, navLinks, mobileMenu, headerCta, languageLabel }}
    />
  );
}
