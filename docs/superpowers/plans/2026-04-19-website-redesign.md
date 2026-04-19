# Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild antoniogoulao.dev from a bare MUI v5 placeholder into a full Warm Brutalist personal site with Next.js 15 App Router, Tailwind CSS, i18n (4 locales), MDX blog, and a dark/light mode toggle.

**Architecture:** Hybrid layout — home page has scrollable Hero + Experience + Projects sections; Blog and Books are dedicated pages. All routes prefixed with `[locale]`. Root `/` detects browser locale client-side and redirects. Static export to `docs/` for GitHub Pages.

**Tech Stack:** Next.js 15 (App Router, `output: 'export'`), React 19, TypeScript 5, Tailwind CSS v3, Framer Motion v11, next-themes, next-intl v3, next-mdx-remote v5, gray-matter, Space Grotesk + Instrument Serif (Google Fonts)

---

## File Map

```
app/
  layout.tsx                        # Root HTML shell + ThemeProvider + fonts
  page.tsx                          # Locale detection redirect (client)
  globals.css                       # Tailwind base + CSS design tokens
  [locale]/
    layout.tsx                      # NextIntlClientProvider + Nav + Footer
    page.tsx                        # Home: Hero + Experience + Projects
    blog/
      page.tsx                      # Blog listing
      [slug]/
        page.tsx                    # Blog post (MDX)
    books/
      page.tsx                      # Reading list

components/
  ThemeProvider.tsx                 # next-themes wrapper (client)
  ThemeToggle.tsx                   # Sun/moon button (client)
  LanguageSwitcher.tsx              # Locale selector (client)
  SectionDivider.tsx                # Orange label + gradient line
  Nav.tsx                           # Sticky nav (client, Framer Motion)
  Footer.tsx                        # Links: GitHub LinkedIn Bluesky Ride&Listen
  home/
    Hero.tsx                        # Animated hero section (client)
    Experience.tsx                  # Timeline (client, scroll-reveal)
    Projects.tsx                    # GitHub cards grid (client, scroll-reveal)

content/
  experience.ts                     # ExperienceEntry[] data
  books.ts                          # Book[] data
  posts/
    en-GB/                          # MDX files per locale
    pt-PT/
    es-ES/
    fr-FR/

lib/
  github.ts                         # fetchGitHubRepos() — build-time API call
  mdx.ts                            # getPostSlugs / getPostMeta / getAllPosts / getPostContent

i18n/
  routing.ts                        # defineRouting — locales + defaultLocale
  request.ts                        # getRequestConfig — loads messages per locale

messages/
  en-GB.json
  pt-PT.json
  es-ES.json
  fr-FR.json

__tests__/
  lib/github.test.ts
  lib/mdx.test.ts
  components/ThemeToggle.test.tsx

next.config.ts                      # output: export, distDir: docs, images unoptimized
tailwind.config.ts                  # darkMode: class, design tokens, font families
postcss.config.js                   # tailwindcss + autoprefixer
tsconfig.json                       # strict, path alias @/*
jest.config.ts                      # next/jest preset
jest.setup.ts                       # @testing-library/jest-dom
.github/workflows/deploy.yml        # Updated: Node 20, single yarn build step
public/CNAME                        # antoniogoulao.dev
```

---

## Task 1: Dependency migration

**Files:**
- Modify: `package.json`
- Delete: `yarn.lock` (will be regenerated)

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "antoniogoulao.dev",
  "author": {
    "name": "Antonio Goulao",
    "email": "antoniomgoulao@protonmail.com",
    "url": "antoniogoulao.dev"
  },
  "description": "My personal website",
  "license": "Apache License 2.0",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "next lint"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "gray-matter": "^4.0.3",
    "next": "^15.0.0",
    "next-intl": "^3.22.0",
    "next-mdx-remote": "^5.0.0",
    "next-themes": "^0.4.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "remark-gfm": "^4.0.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: Delete old lock file and install**

```bash
rm yarn.lock
yarn install
```

Expected: clean install, no MUI/Emotion packages.

- [ ] **Step 3: Verify no old packages remain**

```bash
yarn list --depth=0 | grep -E "@mui|@emotion"
```

Expected: no output.

- [ ] **Step 4: Delete old source files that will be fully replaced**

```bash
rm -rf pages src next-env.d.ts next.config.js tsconfig.json
```

- [ ] **Step 5: Commit**

```bash
git add package.json
git rm -r pages/ src/ next-env.d.ts next.config.js tsconfig.json 2>/dev/null || true
git commit -m "chore: migrate dependencies — MUI→Tailwind, React 17→19, Next.js 15"
```

---

## Task 2: Next.js 15 + TypeScript 5 config

**Files:**
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`

- [ ] **Step 1: Create next.config.ts**

```typescript
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'docs',
  images: {unoptimized: true},
};

export default nextConfig;
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Update GitHub Actions workflow**

Replace `.github/workflows/deploy.yml` with:

```yaml
name: Deploy website

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'
      - run: yarn install --frozen-lockfile
      - run: yarn build
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: Automated Publish
```

- [ ] **Step 5: Commit**

```bash
git add next.config.ts tsconfig.json postcss.config.js .github/workflows/deploy.yml
git commit -m "chore: add Next.js 15 + TypeScript 5 config, update CI to Node 20"
```

---

## Task 3: Testing setup

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Create jest.config.ts**

```typescript
import type {Config} from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({dir: './'});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};

export default createJestConfig(config);
```

- [ ] **Step 2: Create jest.setup.ts**

```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 3: Run the test suite to verify setup**

```bash
yarn test --passWithNoTests
```

Expected: `Test Suites: 0 skipped, 0 total`

- [ ] **Step 4: Commit**

```bash
git add jest.config.ts jest.setup.ts
git commit -m "chore: add Jest + Testing Library setup"
```

---

## Task 4: Tailwind CSS + design tokens

**Files:**
- Create: `tailwind.config.ts`
- Create: `app/globals.css`

- [ ] **Step 1: Create tailwind.config.ts**

```typescript
import type {Config} from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;
```

- [ ] **Step 2: Create app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Light mode — default */
:root {
  --color-background: #FFF8F2;
  --color-surface: #F0E8E0;
  --color-primary: #D9480F;
  --color-secondary: #FFB703;
  --color-foreground: #2B2118;
  --color-muted: #7A6A5A;
}

/* Dark mode */
.dark {
  --color-background: #1A1410;
  --color-surface: #241C16;
  --color-primary: #FF6B00;
  --color-secondary: #FFD166;
  --color-foreground: #F5EDE6;
  --color-muted: #B8A99A;
}

*,
*::before,
*::after {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add Tailwind CSS config with Warm Brutalist design tokens"
```

---

## Task 5: next-themes dark/light mode

**Files:**
- Create: `components/ThemeProvider.tsx`
- Create: `components/ThemeToggle.tsx`
- Create: `__tests__/components/ThemeToggle.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/components/ThemeToggle.test.tsx`:

```typescript
import {render, screen} from '@testing-library/react';
import {ThemeToggle} from '@/components/ThemeToggle';

jest.mock('next-themes', () => ({
  useTheme: () => ({theme: 'dark', setTheme: jest.fn()}),
}));

describe('ThemeToggle', () => {
  it('renders a button with aria-label', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', {name: /toggle theme/i})).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test __tests__/components/ThemeToggle.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/ThemeToggle'`

- [ ] **Step 3: Create components/ThemeProvider.tsx**

```typescript
'use client';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import type {ThemeProviderProps} from 'next-themes';

export function ThemeProvider({children, ...props}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 4: Create components/ThemeToggle.tsx**

```typescript
'use client';
import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';

export function ThemeToggle() {
  const {theme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" aria-hidden />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀' : '🌙'}
    </button>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
yarn test __tests__/components/ThemeToggle.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/ThemeProvider.tsx components/ThemeToggle.tsx __tests__/components/ThemeToggle.test.tsx
git commit -m "feat: add next-themes ThemeProvider and ThemeToggle"
```

---

## Task 6: next-intl i18n setup

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `messages/en-GB.json`
- Create: `messages/pt-PT.json`
- Create: `messages/es-ES.json`
- Create: `messages/fr-FR.json`

- [ ] **Step 1: Create i18n/routing.ts**

```typescript
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en-GB', 'pt-PT', 'es-ES', 'fr-FR'],
  defaultLocale: 'en-GB',
});

export type Locale = (typeof routing.locales)[number];
```

- [ ] **Step 2: Create i18n/request.ts**

```typescript
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create messages/en-GB.json**

```json
{
  "nav": {
    "about": "About",
    "work": "Work",
    "projects": "Projects",
    "blog": "Blog",
    "books": "Books"
  },
  "hero": {
    "greeting": "Hello, I'm",
    "tagline": "Mobile Engineer · Rider · Reader",
    "bio": "Building mobile and web applications at Uphill Health. Passionate about clean systems, long rides on two wheels, and good books.",
    "blogCta": "Read my blog",
    "rideAndListen": "Ride & Listen"
  },
  "sections": {
    "experience": "Experience",
    "projects": "GitHub Projects"
  },
  "blog": {
    "heading": "Writing",
    "subtitle": "Thoughts on software, riding, and books.",
    "noPosts": "No posts yet. Check back soon.",
    "back": "← Back to blog"
  },
  "books": {
    "heading": "Reading List",
    "subtitle": "Books I've read, grouped by year."
  }
}
```

- [ ] **Step 4: Create messages/pt-PT.json**

```json
{
  "nav": {
    "about": "Sobre",
    "work": "Trabalho",
    "projects": "Projetos",
    "blog": "Blog",
    "books": "Livros"
  },
  "hero": {
    "greeting": "Olá, sou o",
    "tagline": "Engenheiro Mobile · Motociclista · Leitor",
    "bio": "A desenvolver aplicações mobile e web na Uphill Health. Apaixonado por sistemas limpos, longas viagens de mota e bons livros.",
    "blogCta": "Ler o blog",
    "rideAndListen": "Ride & Listen"
  },
  "sections": {
    "experience": "Experiência",
    "projects": "Projetos GitHub"
  },
  "blog": {
    "heading": "Escrita",
    "subtitle": "Reflexões sobre software, motas e livros.",
    "noPosts": "Ainda sem publicações. Volte em breve.",
    "back": "← Voltar ao blog"
  },
  "books": {
    "heading": "Lista de Leituras",
    "subtitle": "Livros que li, agrupados por ano."
  }
}
```

- [ ] **Step 5: Create messages/es-ES.json**

```json
{
  "nav": {
    "about": "Sobre mí",
    "work": "Trabajo",
    "projects": "Proyectos",
    "blog": "Blog",
    "books": "Libros"
  },
  "hero": {
    "greeting": "Hola, soy",
    "tagline": "Ingeniero Mobile · Motorista · Lector",
    "bio": "Desarrollando aplicaciones mobile y web en Uphill Health. Apasionado por sistemas limpios, largas rutas en moto y buenos libros.",
    "blogCta": "Leer mi blog",
    "rideAndListen": "Ride & Listen"
  },
  "sections": {
    "experience": "Experiencia",
    "projects": "Proyectos GitHub"
  },
  "blog": {
    "heading": "Escritura",
    "subtitle": "Pensamientos sobre software, motos y libros.",
    "noPosts": "Sin publicaciones aún. Vuelve pronto.",
    "back": "← Volver al blog"
  },
  "books": {
    "heading": "Lista de Lectura",
    "subtitle": "Libros que he leído, agrupados por año."
  }
}
```

- [ ] **Step 6: Create messages/fr-FR.json**

```json
{
  "nav": {
    "about": "À propos",
    "work": "Travail",
    "projects": "Projets",
    "blog": "Blog",
    "books": "Livres"
  },
  "hero": {
    "greeting": "Bonjour, je suis",
    "tagline": "Ingénieur Mobile · Motard · Lecteur",
    "bio": "Je développe des applications mobile et web chez Uphill Health. Passionné par les systèmes propres, les longues balades à moto et les bons livres.",
    "blogCta": "Lire mon blog",
    "rideAndListen": "Ride & Listen"
  },
  "sections": {
    "experience": "Expérience",
    "projects": "Projets GitHub"
  },
  "blog": {
    "heading": "Écriture",
    "subtitle": "Réflexions sur le logiciel, la moto et les livres.",
    "noPosts": "Aucune publication pour l'instant. Revenez bientôt.",
    "back": "← Retour au blog"
  },
  "books": {
    "heading": "Liste de Lecture",
    "subtitle": "Livres lus, regroupés par année."
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add i18n/ messages/
git commit -m "feat: add next-intl routing config and all 4 locale message files"
```

---

## Task 7: Root layout + locale layout

**Files:**
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create app/layout.tsx**

```typescript
import type {Metadata} from 'next';
import {Instrument_Serif, Space_Grotesk} from 'next/font/google';
import {ThemeProvider} from '@/components/ThemeProvider';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'António Goulão',
  description: 'Mobile Engineer · Rider · Reader',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create app/page.tsx (locale detection)**

```typescript
'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {routing} from '@/i18n/routing';

const LOCALE_MAP: Record<string, string> = {
  'pt': 'pt-PT',
  'pt-PT': 'pt-PT',
  'pt-BR': 'pt-PT',
  'es': 'es-ES',
  'es-ES': 'es-ES',
  'fr': 'fr-FR',
  'fr-FR': 'fr-FR',
  'en': 'en-GB',
  'en-GB': 'en-GB',
  'en-US': 'en-GB',
  'en-AU': 'en-GB',
};

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const lang = navigator.language;
    const matched =
      LOCALE_MAP[lang] ??
      LOCALE_MAP[lang.split('-')[0]] ??
      routing.defaultLocale;
    router.replace(`/${matched}`);
  }, [router]);

  return null;
}
```

- [ ] **Step 3: Create app/[locale]/layout.tsx**

```typescript
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {Nav} from '@/components/Nav';
import {Footer} from '@/components/Footer';

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Nav locale={locale} />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
yarn tsc --noEmit
```

Expected: no errors (may warn about missing component files — that's fine at this stage).

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx app/[locale]/layout.tsx
git commit -m "feat: add root layout, locale detection page, and locale layout"
```

---

## Task 8: Nav + LanguageSwitcher components

**Files:**
- Create: `components/LanguageSwitcher.tsx`
- Create: `components/Nav.tsx`
- Create: `components/SectionDivider.tsx`

- [ ] **Step 1: Create components/LanguageSwitcher.tsx**

```typescript
'use client';
import {useRouter, usePathname} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';

const LABELS: Record<Locale, string> = {
  'en-GB': 'EN',
  'pt-PT': 'PT',
  'es-ES': 'ES',
  'fr-FR': 'FR',
};

export function LanguageSwitcher({locale}: {locale: string}) {
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || '/');
  }

  return (
    <div className="flex items-center gap-0.5">
      {routing.locales.map(l => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
            locale === l
              ? 'text-primary border border-primary'
              : 'text-muted hover:text-foreground border border-transparent'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create components/Nav.tsx**

```typescript
'use client';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {ThemeToggle} from './ThemeToggle';
import {LanguageSwitcher} from './LanguageSwitcher';

export function Nav({locale}: {locale: string}) {
  const t = useTranslations('nav');

  return (
    <motion.header
      initial={{y: -16, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.4}}
      className="sticky top-0 z-50 border-b border-surface bg-background/90 backdrop-blur-md"
    >
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href={`/${locale}`}
          className="font-serif italic text-xl text-primary leading-none"
        >
          ag.
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider text-muted">
          <a href={`/${locale}#about`} className="hover:text-foreground transition-colors">
            {t('about')}
          </a>
          <a href={`/${locale}#experience`} className="hover:text-foreground transition-colors">
            {t('work')}
          </a>
          <a href={`/${locale}#projects`} className="hover:text-foreground transition-colors">
            {t('projects')}
          </a>
          <Link href={`/${locale}/blog`} className="hover:text-foreground transition-colors">
            {t('blog')}
          </Link>
          <Link href={`/${locale}/books`} className="hover:text-foreground transition-colors">
            {t('books')}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
```

- [ ] **Step 3: Create components/SectionDivider.tsx**

```typescript
export function SectionDivider({label}: {label: string}) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="text-xs uppercase tracking-widest text-primary shrink-0 font-sans">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-primary/60 to-transparent" />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx components/LanguageSwitcher.tsx components/SectionDivider.tsx
git commit -m "feat: add Nav, LanguageSwitcher, and SectionDivider components"
```

---

## Task 9: Footer component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create components/Footer.tsx**

```typescript
export function Footer() {
  return (
    <footer className="border-t border-surface mt-24">
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} António Goulão
        </p>

        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://github.com/antoniogoulao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/antoniogoulao"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://bsky.app/profile/antoniogoulao.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            Bluesky
          </a>
          <a
            href="https://rideandlisten.antoniogoulao.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 border border-primary text-primary text-xs rounded hover:bg-primary hover:text-background transition-colors"
          >
            Ride & Listen ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer with GitHub, LinkedIn, Bluesky, and Ride & Listen links"
```

---

## Task 10: Hero section

**Files:**
- Create: `components/home/Hero.tsx`

- [ ] **Step 1: Create components/home/Hero.tsx**

```typescript
'use client';
import Link from 'next/link';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';

const fadeUp = (delay: number) => ({
  initial: {opacity: 0, y: 16},
  animate: {opacity: 1, y: 0},
  transition: {duration: 0.5, delay},
});

export function Hero({locale}: {locale: string}) {
  const t = useTranslations('hero');

  return (
    <section id="about" className="relative px-6 py-24 max-w-4xl mx-auto overflow-hidden">
      {/* Ambient gradient bloom */}
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"
      />

      <motion.p {...fadeUp(0.1)} className="text-xs uppercase tracking-widest text-muted mb-4 font-sans">
        {t('greeting')}
      </motion.p>

      <motion.h1
        {...fadeUp(0.2)}
        className="font-serif text-6xl md:text-7xl leading-[1.0] mb-4 text-foreground"
      >
        António{' '}
        <em className="italic text-primary not-italic" style={{fontStyle: 'italic'}}>
          Goulão
        </em>
      </motion.h1>

      <motion.p
        {...fadeUp(0.3)}
        className="text-xs uppercase tracking-widest text-secondary mb-8 font-sans"
      >
        {t('tagline')}
      </motion.p>

      <motion.p
        {...fadeUp(0.4)}
        className="text-muted leading-relaxed max-w-md mb-10 font-sans"
      >
        {t('bio')}
      </motion.p>

      <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-4">
        <Link
          href={`/${locale}/blog`}
          className="px-5 py-2.5 bg-primary text-background text-xs font-bold uppercase tracking-wide rounded hover:bg-primary/90 transition-colors font-sans"
        >
          {t('blogCta')}
        </Link>
        <a
          href="https://rideandlisten.antoniogoulao.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 border border-muted text-muted text-xs uppercase tracking-wide rounded hover:border-foreground hover:text-foreground transition-colors font-sans"
        >
          {t('rideAndListen')} →
        </a>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/Hero.tsx
git commit -m "feat: add Hero section with Framer Motion fade-up animations"
```

---

## Task 11: Experience data + component

**Files:**
- Create: `content/experience.ts`
- Create: `components/home/Experience.tsx`

- [ ] **Step 1: Create content/experience.ts**

Fill in your actual work history. The structure is:

```typescript
export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    title: 'Software Engineer',
    company: 'Uphill Health',
    period: '2022 — Present',
    description: 'Building mobile and web health applications.',
  },
  // Add additional entries here, newest first
];
```

- [ ] **Step 2: Create components/home/Experience.tsx**

```typescript
'use client';
import {useRef} from 'react';
import {motion, useInView} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {experience, type ExperienceEntry} from '@/content/experience';
import {SectionDivider} from '@/components/SectionDivider';

function EntryRow({entry, index}: {entry: ExperienceEntry; index: number}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});

  return (
    <motion.div
      ref={ref}
      initial={{opacity: 0, x: -16}}
      animate={inView ? {opacity: 1, x: 0} : {}}
      transition={{duration: 0.45, delay: index * 0.1}}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center pt-1.5">
        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
        {index < experience.length - 1 && (
          <span className="w-px flex-1 bg-surface mt-2" />
        )}
      </div>
      <div className="pb-8">
        <p className="font-semibold text-foreground font-sans">{entry.title}</p>
        <p className="text-secondary text-sm font-sans">{entry.company}</p>
        <p className="text-muted text-xs mt-0.5 mb-2 font-sans">{entry.period}</p>
        <p className="text-muted text-sm leading-relaxed font-sans">{entry.description}</p>
      </div>
    </motion.div>
  );
}

export function Experience() {
  const t = useTranslations('sections');

  return (
    <section id="experience" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('experience')} />
      <div>
        {experience.map((entry, i) => (
          <EntryRow key={`${entry.company}-${entry.period}`} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add content/experience.ts components/home/Experience.tsx
git commit -m "feat: add Experience data file and animated timeline component"
```

---

## Task 12: GitHub API lib + Projects component

**Files:**
- Create: `lib/github.ts`
- Create: `components/home/Projects.tsx`
- Create: `__tests__/lib/github.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/github.test.ts`:

```typescript
import {fetchGitHubRepos} from '@/lib/github';

const mockRepos = [
  {id: 1, name: 'alpha', description: 'First', html_url: 'https://github.com/a', stargazers_count: 5, language: 'TypeScript', fork: false},
  {id: 2, name: 'beta', description: 'Second', html_url: 'https://github.com/b', stargazers_count: 12, language: 'Go', fork: false},
  {id: 3, name: 'forked', description: 'Forked', html_url: 'https://github.com/c', stargazers_count: 20, language: 'Rust', fork: true},
];

global.fetch = jest.fn();

describe('fetchGitHubRepos', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns non-fork repos sorted by stars descending', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
    });

    const result = await fetchGitHubRepos('testuser');

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('beta');
    expect(result[1].name).toBe('alpha');
  });

  it('respects the limit parameter', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockRepos[0], mockRepos[1]],
    });

    const result = await fetchGitHubRepos('testuser', 1);
    expect(result).toHaveLength(1);
  });

  it('returns empty array when API responds with non-ok status', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ok: false});
    const result = await fetchGitHubRepos('testuser');
    expect(result).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    const result = await fetchGitHubRepos('testuser');
    expect(result).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test __tests__/lib/github.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/github'`

- [ ] **Step 3: Create lib/github.ts**

```typescript
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

export async function fetchGitHubRepos(
  username: string,
  limit = 6
): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=100`,
      {cache: 'force-cache'}
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit);
  } catch {
    return [];
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test __tests__/lib/github.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: Create components/home/Projects.tsx**

```typescript
'use client';
import {useRef} from 'react';
import {motion, useInView} from 'framer-motion';
import {useTranslations} from 'next-intl';
import type {GitHubRepo} from '@/lib/github';
import {SectionDivider} from '@/components/SectionDivider';

function ProjectCard({repo, index}: {repo: GitHubRepo; index: number}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{opacity: 0, y: 20}}
      animate={inView ? {opacity: 1, y: 0} : {}}
      transition={{duration: 0.4, delay: index * 0.07}}
      whileHover={{y: -4, transition: {duration: 0.2}}}
      className="block bg-surface border border-surface rounded-lg p-5 hover:border-primary/40 transition-colors group"
    >
      <h3 className="font-semibold text-foreground mb-1.5 font-sans group-hover:text-primary transition-colors">
        {repo.name}
      </h3>
      {repo.description && (
        <p className="text-muted text-sm mb-4 leading-relaxed font-sans">{repo.description}</p>
      )}
      <div className="flex items-center gap-4 text-xs text-muted font-sans">
        {repo.language && <span className="text-secondary">{repo.language}</span>}
        <span>★ {repo.stargazers_count}</span>
      </div>
    </motion.a>
  );
}

export function Projects({repos}: {repos: GitHubRepo[]}) {
  const t = useTranslations('sections');

  return (
    <section id="projects" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('projects')} />
      <div className="grid sm:grid-cols-2 gap-4">
        {repos.map((repo, i) => (
          <ProjectCard key={repo.id} repo={repo} index={i} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/github.ts components/home/Projects.tsx __tests__/lib/github.test.ts
git commit -m "feat: add GitHub API lib with tests and Projects card grid"
```

---

## Task 13: Home page assembly

**Files:**
- Create: `app/[locale]/page.tsx`

- [ ] **Step 1: Create app/[locale]/page.tsx**

```typescript
import {setRequestLocale} from 'next-intl/server';
import {Hero} from '@/components/home/Hero';
import {Experience} from '@/components/home/Experience';
import {Projects} from '@/components/home/Projects';
import {fetchGitHubRepos} from '@/lib/github';

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const repos = await fetchGitHubRepos('antoniogoulao');

  return (
    <>
      <Hero locale={locale} />
      <Experience />
      <Projects repos={repos} />
    </>
  );
}
```

- [ ] **Step 2: Run the dev server to verify the home page renders**

```bash
yarn dev
```

Open http://localhost:3000/en-GB and verify: nav appears, Hero section shows, Experience and Projects sections render.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat: assemble home page with Hero, Experience, and Projects"
```

---

## Task 14: Books data + page

**Files:**
- Create: `content/books.ts`
- Create: `app/[locale]/books/page.tsx`

- [ ] **Step 1: Create content/books.ts**

Fill in your actual reading list (newest year first within each year group):

```typescript
export interface Book {
  title: string;
  author: string;
  year: number;
  note?: string;
}

export const books: Book[] = [
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    year: 2024,
    note: 'Essential reading for any engineer.',
  },
  // Add your actual books here
];
```

- [ ] **Step 2: Create app/[locale]/books/page.tsx**

```typescript
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {books} from '@/content/books';
import {SectionDivider} from '@/components/SectionDivider';

export default async function BooksPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('books');

  const byYear = books.reduce<Record<number, typeof books>>((acc, book) => {
    (acc[book.year] ??= []).push(book);
    return acc;
  }, {});

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('heading')} />
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground mb-3">
        {t('heading')}
      </h1>
      <p className="text-muted mb-14 font-sans">{t('subtitle')}</p>

      {years.map(year => (
        <div key={year} className="mb-14">
          <p className="text-xs uppercase tracking-widest text-secondary mb-4 font-sans">
            {year}
          </p>
          <div className="divide-y divide-surface">
            {byYear[year].map(book => (
              <div
                key={`${book.title}-${book.author}`}
                className="py-4 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors font-sans">
                      {book.title}
                    </p>
                    <p className="text-muted text-sm font-sans">{book.author}</p>
                  </div>
                </div>
                {book.note && (
                  <p className="text-muted text-sm mt-2 italic font-serif">{book.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify at http://localhost:3000/en-GB/books**

Expected: page renders with year groups and book entries.

- [ ] **Step 4: Commit**

```bash
git add content/books.ts app/[locale]/books/page.tsx
git commit -m "feat: add Books data file and reading list page"
```

---

## Task 15: MDX blog setup + listing page

**Files:**
- Create: `lib/mdx.ts`
- Create: `__tests__/lib/mdx.test.ts`
- Create: `content/posts/en-GB/hello-world.mdx`
- Create: `app/[locale]/blog/page.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/mdx.test.ts`:

```typescript
import {getPostSlugs, getPostMeta, getAllPosts} from '@/lib/mdx';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: (...args: string[]) => args.join('/'),
}));

const FAKE_MDX = `---
title: Hello World
date: "2026-04-19"
excerpt: My first post.
tags: ["personal"]
---

Post content here.`;

describe('getPostSlugs', () => {
  it('returns slugs stripped of .mdx extension', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue([
      'hello-world.mdx',
      'second.mdx',
      'ignore.ts',
    ]);
    expect(getPostSlugs('en-GB')).toEqual(['hello-world', 'second']);
  });

  it('returns empty array when directory does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(getPostSlugs('en-GB')).toEqual([]);
  });
});

describe('getPostMeta', () => {
  it('parses frontmatter fields correctly', () => {
    (fs.readFileSync as jest.Mock).mockReturnValue(FAKE_MDX);
    const meta = getPostMeta('hello-world', 'en-GB');
    expect(meta).toEqual({
      slug: 'hello-world',
      title: 'Hello World',
      date: '2026-04-19',
      excerpt: 'My first post.',
      tags: ['personal'],
    });
  });
});

describe('getAllPosts', () => {
  it('returns posts sorted newest first', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue(['old.mdx', 'new.mdx']);
    (fs.readFileSync as jest.Mock)
      .mockReturnValueOnce('---\ntitle: Old\ndate: "2025-01-01"\nexcerpt: Old.\n---\n')
      .mockReturnValueOnce('---\ntitle: New\ndate: "2026-01-01"\nexcerpt: New.\n---\n');
    const posts = getAllPosts('en-GB');
    expect(posts[0].title).toBe('New');
    expect(posts[1].title).toBe('Old');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
yarn test __tests__/lib/mdx.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/mdx'`

- [ ] **Step 3: Create lib/mdx.ts**

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
}

function postsDir(locale: string): string {
  return path.join(process.cwd(), 'content', 'posts', locale);
}

export function getPostSlugs(locale: string): string[] {
  const dir = postsDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));
}

export function getPostMeta(slug: string, locale: string): PostMeta {
  const raw = fs.readFileSync(path.join(postsDir(locale), `${slug}.mdx`), 'utf8');
  const {data} = matter(raw);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    tags: data.tags as string[] | undefined,
  };
}

export function getAllPosts(locale: string): PostMeta[] {
  return getPostSlugs(locale)
    .map(slug => getPostMeta(slug, locale))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostContent(slug: string, locale: string): {meta: PostMeta; content: string} {
  const raw = fs.readFileSync(path.join(postsDir(locale), `${slug}.mdx`), 'utf8');
  const {data, content} = matter(raw);
  return {
    meta: {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: data.excerpt as string,
      tags: data.tags as string[] | undefined,
    },
    content,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test __tests__/lib/mdx.test.ts
```

Expected: PASS (5 tests)

- [ ] **Step 5: Create content/posts/en-GB/hello-world.mdx**

```mdx
---
title: "Hello, World"
date: "2026-04-19"
excerpt: "First post on the new site. A bit about what to expect here."
tags: ["personal"]
---

Welcome to my new site. I rebuilt it from scratch — you can read about the tech stack on [GitHub](https://github.com/antoniogoulao/antoniogoulao.dev).

More posts coming soon.
```

- [ ] **Step 6: Create app/[locale]/blog/page.tsx**

```typescript
import Link from 'next/link';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {getAllPosts} from '@/lib/mdx';
import {SectionDivider} from '@/components/SectionDivider';

export default async function BlogPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = getAllPosts(locale);

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('heading')} />
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground mb-3">
        {t('heading')}
      </h1>
      <p className="text-muted mb-14 font-sans">{t('subtitle')}</p>

      {posts.length === 0 ? (
        <p className="text-muted font-sans">{t('noPosts')}</p>
      ) : (
        <div className="divide-y divide-surface">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="block py-8 group"
            >
              <p className="text-xs text-muted uppercase tracking-wide mb-2 font-sans">
                {post.date}
              </p>
              <h2 className="font-serif italic text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors mb-3">
                {post.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed font-sans">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add lib/mdx.ts __tests__/lib/mdx.test.ts content/posts/ app/[locale]/blog/page.tsx
git commit -m "feat: add MDX lib with tests, sample post, and blog listing page"
```

---

## Task 16: Blog post page

**Files:**
- Create: `app/[locale]/blog/[slug]/page.tsx`

- [ ] **Step 1: Create app/[locale]/blog/[slug]/page.tsx**

```typescript
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {MDXRemote} from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import {getPostContent, getPostSlugs} from '@/lib/mdx';
import {routing} from '@/i18n/routing';

export async function generateStaticParams() {
  const params: {locale: string; slug: string}[] = [];
  for (const locale of routing.locales) {
    const slugs = getPostSlugs(locale);
    for (const slug of slugs) {
      params.push({locale, slug});
    }
  }
  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const {meta, content} = getPostContent(slug, locale);

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto">
      <Link
        href={`/${locale}/blog`}
        className="text-xs uppercase tracking-wide text-muted hover:text-foreground transition-colors mb-10 block font-sans"
      >
        {t('back')}
      </Link>

      <p className="text-xs text-muted uppercase tracking-wide mb-4 font-sans">{meta.date}</p>

      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground mb-12 leading-tight">
        {meta.title}
      </h1>

      <div className="prose prose-stone dark:prose-invert max-w-none font-sans">
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify blog post renders at http://localhost:3000/en-GB/blog/hello-world**

Expected: title displays, back link works, content renders with prose typography.

- [ ] **Step 3: Run all tests**

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add app/[locale]/blog/[slug]/page.tsx
git commit -m "feat: add MDX blog post page with static params generation"
```

---

## Task 17: CNAME + static export verification

**Files:**
- Create: `public/CNAME`
- Verify: `docs/` output

- [ ] **Step 1: Move CNAME to public/**

The current `docs/CNAME` is generated content and gets overwritten on each build. Put it in `public/` so Next.js copies it into `docs/` automatically:

```bash
echo "antoniogoulao.dev" > public/CNAME
```

- [ ] **Step 2: Run the production build**

```bash
yarn build
```

Expected: build completes without errors. `docs/` directory is populated with static HTML for all locale routes.

- [ ] **Step 3: Verify output structure**

```bash
ls docs/
```

Expected output includes: `en-GB/`, `pt-PT/`, `es-ES/`, `fr-FR/`, `CNAME`, `index.html`, `_next/`

- [ ] **Step 4: Verify CNAME is present**

```bash
cat docs/CNAME
```

Expected: `antoniogoulao.dev`

- [ ] **Step 5: Run all tests one final time**

```bash
yarn test
```

Expected: all tests pass.

- [ ] **Step 6: Fill in real content**

Before shipping, update these two files with real data:
- `content/experience.ts` — your actual work history
- `content/books.ts` — your actual reading list

- [ ] **Step 7: Commit**

```bash
git add public/CNAME
git rm docs/CNAME 2>/dev/null || true
git add content/experience.ts content/books.ts
git commit -m "feat: complete website rebuild — Warm Brutalist, i18n, MDX blog, Books, Projects"
```

---

## Post-launch: add blog posts in other locales

For each new locale translation of a post, create the corresponding MDX file:

```
content/posts/pt-PT/hello-world.mdx
content/posts/es-ES/hello-world.mdx
content/posts/fr-FR/hello-world.mdx
```

Each file follows the same frontmatter schema. The blog listing page gracefully shows empty state if no posts exist for a locale.