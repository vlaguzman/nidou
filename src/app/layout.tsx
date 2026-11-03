import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { siteMetadata } from "@/data/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f9f6f0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geist.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
