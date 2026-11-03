"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { headerCta, mobileMenu, navLinks, sectionIds } from "@/data/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "border-b border-border/70 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href={`#${sectionIds.inicio}`} className="flex items-center" aria-label="NIDOU, inicio">
          <Image
            src="/nidou-logo.png"
            alt="NIDOU"
            width={132}
            height={42}
            priority
            className="h-9 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={headerCta.href}
            className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {headerCta.label}
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? mobileMenu.closeLabel : mobileMenu.openLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label={mobileMenu.navLabel}
          className="border-t border-border/70 px-5 pb-4 pt-2 sm:px-8 md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-base text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
