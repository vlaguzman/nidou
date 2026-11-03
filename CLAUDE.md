@AGENTS.md

# NIDOU landing page

Single-page, Spanish-only landing for NIDOU (motherhood community + emotional wellbeing tracking). No i18n library, no `[lang]` routing.

## Stack

- Next 16 (App Router, `next build --webpack`), React 19, TypeScript strict, npm.
- Tailwind 4, CSS-first: tokens live in the `@theme` block of `src/app/globals.css` (brand palette cream/navy/sage/terracotta, semantic colors, text-safe variants `sage-text`/`terracotta-text` (exposed as `secondary-text`/`accent-text`), fonts, radius). There is no `tailwind.config`. Fonts (Fraunces for headings, Geist for body) are loaded with `next/font/google` in `src/app/layout.tsx`.
- Vitest 5 + Testing Library. Path alias `@/*` -> `./src/*`.
- Scripts: `dev`, `build`, `start`, `typecheck`, `test`, `test:coverage`. CI (`.github/workflows/test.yml`) runs typecheck, coverage, then `npm run build`.
- `dev` is plain `next dev` (Turbopack, the Next 16 default) while `build` is `next build --webpack` (house standard across our other projects), so the two bundlers can diverge. CI therefore runs the real `build` after the tests; run `npm run build` locally before shipping bundler-sensitive changes.

## Structure

- `src/app/` layout, page, global CSS, favicon (`icon.svg`).
- `src/components/landing/` one PascalCase named-export component per section, flat, with its `*.test.tsx` next to it. Page order: SiteHeader, Hero (+FeelingCard), CommunityIntro, Testimonials, ValuesSection, WellbeingSection (+EmotionalChart), HowItWorks, GallerySection, EmotionalHistory, FinalCta, SiteFooter. Helpers: Reveal (scroll reveal), Enso (logo mark), Eyebrow.
- `src/data/` ALL copy and content, typed, one module per section, each with a `*.test.ts`. Components must not hardcode copy; section anchors come from `sectionIds` in `src/data/site.ts`.
- `src/lib/` pure helpers (chart geometry).
- `public/` static assets (`images/*.webp`, `nidou-logo.webp`).

## Conventions

- Strict TDD: write the failing Vitest test first. `*.test.ts` run in node, `*.test.tsx` in jsdom. Coverage thresholds (lines/statements/functions 80, branches 70) are enforced by `npm run test:coverage`.
- Do not add UI libraries (shadcn, cva, clsx, tailwind-merge) or abstractions without 3+ uses. CTAs are plain `<a>`/`<button>` with Tailwind classes.
- Brand sage/terracotta fail WCAG AA as text on cream: use `text-secondary-text`/`text-accent-text` (and `bg-accent-text` behind cream text) for text, keep `secondary`/`accent` for backgrounds and decoration. `globals.test.ts` asserts the ratios.
- `Reveal` renders visible on the server and only applies the hidden state after mounting on the client (only when `IntersectionObserver` exists and the element is below the fold; elements already in the viewport are never hidden). `EmotionalChart` follows the same pattern. Never wrap above-the-fold content in it.
- Respect `prefers-reduced-motion` for every animation (`globals.css` has one reduced-motion block; add new animated classes there).
- `src/app/globals.css` applies to every route: give custom classes specific names and keep Tailwind utilities for everything else.
- No dark mode, no ESLint/Prettier.

## Known placeholders

- `FinalCta` email form only flips local state and discards the email; there is no backend yet (the confirmation copy says so honestly).
- `href="#"` in the footer ("Sobre nosotras", Instagram) has no destination yet. The "Me sumo al siguiente" button in `FeelingCard` only links somewhere for the "Sola" mood (a Google Form, via `joinHref`); the other moods still render a placeholder button with no destination.
