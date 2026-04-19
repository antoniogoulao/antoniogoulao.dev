# Website Redesign — Design Spec
**Date:** 2026-04-19  
**Status:** Approved

---

## Overview

Full rebuild of antoniogoulao.dev. Two goals: (1) update all dependencies to modern versions, (2) replace the placeholder MUI site with a real personal website. The design direction is **Warm Brutalist** — bold but human, more personality than SaaS template.

---

## Design System

### Palette

**Dark mode (default)**
| Token | Value |
|---|---|
| Background | `#1A1410` |
| Surface | `#241C16` |
| Primary | `#FF6B00` (burnt orange) |
| Secondary | `#FFD166` (warm yellow) |
| Text | `#F5EDE6` |
| Muted | `#B8A99A` |

**Light mode**
| Token | Value |
|---|---|
| Background | `#FFF8F2` |
| Surface | `#FFFFFF` |
| Primary | `#D9480F` |
| Secondary | `#FFB703` |
| Text | `#2B2118` |
| Muted | `#7A6A5A` |

### Typography
- **Display / headings:** Instrument Serif (Google Fonts) — italic variant used for accents
- **Body / UI:** Space Grotesk (Google Fonts)

### Gradients
Subtle radial gradient blooms using primary orange at low opacity (~15%) placed behind hero and section headers. Section dividers use a `linear-gradient(90deg, primary, transparent)` line. Discretionary use encouraged to add depth without overwhelming.

### Motion
Framer Motion throughout:
- Scroll-triggered reveal for sections (fade up, ~0.4s)
- Hover lift on project cards and book cards
- Page transition fade (layout-level)
- Dark/light mode toggle with smooth color transition (CSS `transition` on theme tokens)

---

## Site Structure

### Layout: Hybrid

Home page contains scrollable sections (Hero, Experience, Projects). Content-heavy sections (Blog, Books) are dedicated pages.

### Routes

```
/                          → Locale detection + redirect (client-side)
/[locale]/                 → Home page
/[locale]/blog/            → Blog listing
/[locale]/blog/[slug]/     → Blog post (MDX)
/[locale]/books/           → Full reading list
```

### Navigation (sticky)

```
ag.  |  About  Work  Projects  Blog  Books  |  [PT] [☀/🌙]
```

- `ag.` — logo in italic Instrument Serif, orange, links to `#top`
- Anchor links for on-page sections (About, Work, Projects)
- Page links for Blog and Books
- Language switcher (PT / EN / ES / FR)
- Dark/light toggle

---

## Page: Home (`/[locale]/`)

### Hero section
- Label: "Hello, I'm" (small, muted, uppercase)
- Name: `António` + italic orange `Goulão` (large Instrument Serif)
- Tagline: `Mobile Engineer · Rider · Reader` (warm yellow, uppercase, spaced)
- Short bio paragraph (2–3 lines, muted)
- CTAs: primary button "Read my blog" → `/blog`, ghost button "Ride & Listen →" → external link
- Decorative: subtle radial gradient bloom top-right

### Experience section
- Section divider: orange label + gradient line
- Vertical timeline using orange/yellow dots
- Each entry: job title, company (warm yellow), period (muted)
- Data source: `/content/experience.ts` (TypeScript array)

### GitHub Projects section
- Section divider: same pattern
- 2-column card grid
- Each card (Surface background): repo name, description, language badge (warm yellow), star count
- Data source: GitHub API fetched at build time (`https://api.github.com/users/antoniogoulao/repos`)
- Sorted by stars descending, max 6 repos shown
- Cards have hover lift animation (Framer Motion)

### Footer
- Left: copyright
- Right: GitHub · LinkedIn · Bluesky · **Ride & Listen ↗** (primary button)

---

## Page: Blog (`/[locale]/blog/`)

- Grid of post cards (title, date, excerpt, read-time estimate)
- Posts authored as `.mdx` files in `/content/posts/[locale]/`
- Metadata via frontmatter: `title`, `date`, `excerpt`, `tags`
- Individual post page: `/[locale]/blog/[slug]/` — full MDX rendered with custom components (code blocks, callouts, etc.)

## Page: Books (`/[locale]/books/`)

- Full reading list, grouped by year read (newest first)
- Each entry: title, author, year finished, optional short note
- Data source: `/content/books.ts` (TypeScript array)
- Subtle hover state on rows

---

## Internationalisation

- Library: `next-intl`
- Locales: `pt-PT`, `en-GB` (fallback), `es-ES`, `fr-FR`
- Translation strings in `/messages/[locale].json`
- Root `/` page: client-side `navigator.language` detection → redirect to matching locale prefix. Falls back to `en-GB`.
- All routes prefixed with `[locale]` segment

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15, App Router, `output: 'export'` |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Dark/light mode | `next-themes` |
| i18n | `next-intl` |
| Blog authoring | MDX via `@next/mdx` |
| Structured content | TypeScript data files (`/content/`) |
| GitHub data | Build-time fetch from GitHub API |
| Fonts | Google Fonts (Instrument Serif + Space Grotesk) |
| Deployment | GitHub Pages via `docs/` static export |

### Dependency changes
**Remove:** `@emotion/react`, `@emotion/server`, `@emotion/styled`, `@mui/material`  
**Upgrade:** React 17→19, TypeScript 4→5, Next.js→15  
**Add:** `tailwindcss`, `framer-motion`, `next-themes`, `next-intl`, `@next/mdx`, `gray-matter`

---

## Content Files

```
/content/
  experience.ts      # Array of { title, company, period, description }
  books.ts           # Array of { title, author, year, note? }
/content/posts/
  pt-PT/
  en-GB/
  es-ES/
  fr-FR/
/messages/
  pt-PT.json
  en-GB.json
  es-ES.json
  fr-FR.json
```

---

## Out of Scope

- CMS or admin UI
- Comments on blog posts
- Search
- RSS feed (can be added later)
- Analytics (can be added later)
