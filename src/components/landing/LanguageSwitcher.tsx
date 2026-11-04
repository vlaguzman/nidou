import Link from "next/link";
import { LOCALES, localePath, type Locale } from "@/i18n/config";

/** Short label shown in the header and the language's name in its own language. */
const LANGUAGES: Record<Locale, { label: string; name: string }> = {
  en: { label: "EN", name: "English" },
  es: { label: "ES", name: "Español" },
};

const linkClass =
  "rounded-full px-2.5 py-1 text-sm text-foreground/70 transition-colors hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-primary aria-[current=page]:underline aria-[current=page]:underline-offset-4";

type Props = {
  /** Locale of the page being shown. */
  lang: Locale;
  /** Locale-free path of the page being shown, so the switch lands on the equivalent page. */
  path: string;
  /** Accessible name of the navigation, in the language of the page (from site data). */
  label: string;
};

export function LanguageSwitcher({ lang, path, label }: Props) {
  return (
    <nav className="flex items-center" aria-label={label}>
      {LOCALES.map((target) => (
        <Link
          key={target}
          href={localePath(target, path)}
          lang={target}
          hrefLang={target}
          aria-label={LANGUAGES[target].name}
          aria-current={target === lang ? "page" : undefined}
          className={linkClass}
        >
          {LANGUAGES[target].label}
        </Link>
      ))}
    </nav>
  );
}
