@AGENTS.md

# NIDOU landing page

Single-page, bilingual (Spanish/English) landing for NIDOU (motherhood community + emotional wellbeing tracking). No i18n library: locale routing is hand-rolled under `src/i18n/`.

## Stack

- Next 16 (App Router, `next build --webpack`), React 19, TypeScript strict, npm.
- Tailwind 4, CSS-first: tokens live in the `@theme` block of `src/app/globals.css` (brand palette cream/navy/sage/terracotta, semantic colors, text-safe variants `sage-text`/`terracotta-text` (exposed as `secondary-text`/`accent-text`), fonts, radius). There is no `tailwind.config`. Fonts (Fraunces for headings, Geist for body) are loaded with `next/font/google` in `src/app/layout.tsx`.
- Vitest 5 + Testing Library. Path alias `@/*` -> `./src/*`.
- Scripts: `dev`, `build`, `start`, `typecheck`, `test`, `test:coverage`. CI (`.github/workflows/test.yml`) runs typecheck, coverage, then `npm run build`.
- `dev` is plain `next dev` (Turbopack, the Next 16 default) while `build` is `next build --webpack` (house standard across our other projects), so the two bundlers can diverge. CI therefore runs the real `build` after the tests; run `npm run build` locally before shipping bundler-sensitive changes.

## Structure

- `src/app/[lang]/` layout and page (routes `/es` and `/en`), `src/app/globals.css`, favicon `src/app/icon.svg`.
- `src/i18n/` `config.ts` (`LOCALES`, `DEFAULT_LOCALE = "es"`, `hasLocale`, `localePath`, `pickLocale`, `alternatesFor`) and `redirect.ts`. `src/proxy.ts` (Next 16 proxy) redirects unprefixed paths with a 307 to `/es` or `/en` using a valid `NEXT_LOCALE` cookie first, then `Accept-Language`, falling back to Spanish (an invalid cookie value is ignored). On a request with a locale prefix it sets `NEXT_LOCALE` (only when the stored value differs) (path `/`, 1 year, `sameSite=lax`) so the chosen language is remembered; the pure logic lives in `redirect.ts`, `proxy.ts` stays thin; its matcher skips `_next`, `api` and anything with a file extension (images, `icon.svg`).
- `src/components/landing/` one PascalCase named-export component per section, flat, with its `*.test.tsx` next to it. Page order: SiteHeader, Hero (+FeelingCard), CommunityIntro, Testimonials, ValuesSection, WellbeingSection (+EmotionalChart), HowItWorks, GallerySection, EmotionalHistory, FinalCta, SiteFooter. Helpers: Reveal (scroll reveal), Enso (logo mark), Eyebrow, LanguageSwitcher (EN/ES links in the SiteHeader desktop bar and inside the mobile menu).
- `src/data/` ALL copy and content, typed, one module per section, each with a `*.test.ts`. Components must not hardcode copy; section anchors come from `sectionIds` in `src/data/site.ts`.
- `src/test/shape.ts` structural fingerprint used by data tests.
- `src/lib/` pure helpers (chart geometry).
- `public/` static assets (`images/*.webp`, `nidou-logo.webp`).

## i18n

- Each data module holds a `Record<Locale, Content>` and exports `getX(lang)`. Locale-neutral values (`sectionIds`, hrefs, image paths, `joinHref`, email, chart numbers, icons) are defined once and shared. Anchor ids stay the Spanish ones in both locales.
- Every data test asserts `shape(getX("en"))` equals `shape(getX("es"))`, so a missing translation or item count mismatch fails.
- Server sections take a `lang: Locale` prop and call the getters. Client components (`SiteHeaderBar`, `FeelingCard`, `EmotionalChart`, `TestimonialList`, `FinalCtaForm`) receive their content via props from a server parent and must not import data modules (type-only imports are fine). Sections that need client state are a server wrapper plus a client child (e.g. `Testimonials` + `TestimonialList`).
- `LanguageSwitcher` keeps the reader's section: server-rendered hrefs are hash-free (`/en`), and after mount (and on `hashchange`) it appends `window.location.hash`, valid in both locales because anchor ids are locale-neutral. It takes an `onNavigate` callback so the mobile menu closes when a language link is used.
- The layout sets `<html lang>`, has `dynamicParams = false` and per-locale `generateMetadata` (title/description). There is no `metadataBase` or hreflang `alternates` yet because the site has no production URL; add both (`alternatesFor`) when it does.
- `LanguageSwitcher` is a client component that takes `lang`, `path`, the `label` (`languageLabel` in site data) and an optional `onNavigate`; it links `/` to `/es` and `/en` with `next/link`. The hash it carries is the last section the reader jumped to via an anchor, not the scroll position.
- `typecheck` runs `next typegen` first: the `[lang]` layout and page use the global `LayoutProps`/`PageProps` route types, which only exist after Next generates them (a clean CI checkout has no `.next`).

## Conventions

- Strict TDD: write the failing Vitest test first. `*.test.ts` run in node, `*.test.tsx` in jsdom. Coverage thresholds (lines/statements/functions 80, branches 70) are enforced by `npm run test:coverage`.
- Do not add UI libraries (shadcn, cva, clsx, tailwind-merge) or abstractions without 3+ uses. CTAs are plain `<a>`/`<button>` with Tailwind classes.
- Brand sage/terracotta fail WCAG AA as text on cream: use `text-secondary-text`/`text-accent-text` (and `bg-accent-text` behind cream text) for text, keep `secondary`/`accent` for backgrounds and decoration. `globals.test.ts` asserts the ratios.
- `Reveal` renders visible on the server and only applies the hidden state after mounting on the client (only when `IntersectionObserver` exists and the element is below the fold; elements already in the viewport are never hidden). `EmotionalChart` follows the same pattern. Never wrap above-the-fold content in it.
- Respect `prefers-reduced-motion` for every animation (`globals.css` has one reduced-motion block; add new animated classes there).
- `src/app/globals.css` applies to every route: give custom classes specific names and keep Tailwind utilities for everything else.
- No dark mode, no ESLint/Prettier.

## Mood insights

- Each mood in `src/data/feelings.ts` has an `insight` shown on the back of `FeelingCard` (the old fixed front line is gone). The stats are static, sourced data (NCT 2026; The Lancet Public Health 2023); sources are locale-neutral and rendered with `card.sourceLabel`. Positive moods have no source.
- `FeelingCard` is as tall as its visible face: the hidden face is `absolute` (inert, backface-hidden), so the card height changes on flip and the hero reflows. The overflowing hidden face is clipped by Hero's `overflow-hidden`; keep it. The insight box unfolds and fades in with the flip (`data-insight`, `grid-rows` 0fr→1fr).

## Known placeholders

- `FinalCta` email form only flips local state and discards the email; there is no backend yet (the confirmation copy says so honestly).
- The Google Form behind `joinHref` is a Spanish-language destination for both locales, and the `FinalCta` signup has no backend (the confirmation text is translated, but nothing is collected); only the surrounding UI copy is translated.
- `href="#"` in the footer ("Sobre nosotras") has no destination yet. Instagram is real (`INSTAGRAM_HREF` in `src/data/site.ts`, opens in a new tab). The "Me sumo al siguiente" button in `FeelingCard` only links somewhere for the "Saturada" mood ("Cita con el artista") (a Google Form, via `joinHref`); the other moods still render a placeholder button with no destination.
