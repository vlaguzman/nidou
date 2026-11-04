import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { notFound } from "next/navigation";
import { getSite, SITE_URL } from "@/data/site";
import { alternatesFor, hasLocale, LOCALES } from "@/i18n/config";
import "../globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });

// Only the supported locales exist; any other first segment is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Pick<LayoutProps<"/[lang]">, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { title, description } = getSite(lang).metadata;
  return { metadataBase: new URL(SITE_URL), title, description, alternates: alternatesFor(lang, "/") };
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f9f6f0",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${geist.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
