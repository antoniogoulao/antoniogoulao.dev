# Active Nav Indicator, Mouse-Following Gradient & Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an active dot indicator to nav links, a mouse-following radial gradient to the hero section, and an SVG favicon matching the site logo.

**Architecture:** Three independent changes — `components/Nav.tsx` gains `usePathname` + `IntersectionObserver` to track the active page/section and renders a dot beneath the active link; `components/home/Hero.tsx` replaces a static blurred blob with a mouse-tracked `radial-gradient` inline style; `app/icon.svg` is created as a new file. No new dependencies.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS 3, Framer Motion, Jest 29 + React Testing Library 16

**Work directory:** `/path/to/repo/.worktrees/website-redesign`
**Run tests with:** `npx jest --no-coverage` (from the worktree — `jest` is not in PATH, use `npx`)

---

### Task 1: Favicon

**Files:**
- Create: `app/icon.svg`

- [ ] **Step 1: Create the SVG favicon**

Create `app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="6" fill="#1a1410"/>
  <text x="16" y="22" text-anchor="middle"
        font-family="Georgia, serif" font-style="italic"
        font-size="17" fill="#ff6b00" letter-spacing="-0.5">ag.</text>
</svg>
```

Next.js App Router automatically picks up `app/icon.svg` and injects `<link rel="icon">` into every page's `<head>`. No layout changes needed.

- [ ] **Step 2: Verify in the browser**

Start the dev server:
```bash
npx next dev
```

Open `http://localhost:3000/en-GB`. Check the browser tab — it should show a dark rounded square with orange "ag." text. Check DevTools → Elements → `<head>` and confirm a `<link rel="icon" href="/icon.svg">` tag is present.

- [ ] **Step 3: Commit**

```bash
git add app/icon.svg
git commit -m "feat: add SVG favicon with ag. initials"
```

---

### Task 2: Active Nav Indicator

**Files:**
- Modify: `components/Nav.tsx`
- Create: `__tests__/components/Nav.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/Nav.test.tsx`:

```tsx
import {render, screen} from '@testing-library/react';
import {Nav} from '@/components/Nav';

const mockPathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => null,
}));

jest.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => null,
}));

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy({}, {
      get(_: unknown, tag: string) {
        return ({children, initial: _i, animate: _a, transition: _t, ...props}: {children?: React.ReactNode; initial?: unknown; animate?: unknown; transition?: unknown} & React.HTMLAttributes<HTMLElement>) =>
          React.createElement(tag, props, children);
      },
    }),
  };
});

beforeEach(() => {
  mockPathname.mockReturnValue('/en-GB');
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  }));
});

describe('Nav active dot', () => {
  it('shows dot on the blog link when on the blog page', () => {
    mockPathname.mockReturnValue('/en-GB/blog');
    render(<Nav locale="en-GB" />);
    const blogLink = screen.getByRole('link', {name: 'blog'});
    const dot = blogLink.querySelector('span');
    expect(dot).toHaveClass('opacity-100');
  });

  it('shows dot on the books link when on the books page', () => {
    mockPathname.mockReturnValue('/en-GB/books');
    render(<Nav locale="en-GB" />);
    const booksLink = screen.getByRole('link', {name: 'books'});
    const dot = booksLink.querySelector('span');
    expect(dot).toHaveClass('opacity-100');
  });

  it('hides dot on the blog link when on the home page', () => {
    mockPathname.mockReturnValue('/en-GB');
    render(<Nav locale="en-GB" />);
    const blogLink = screen.getByRole('link', {name: 'blog'});
    const dot = blogLink.querySelector('span');
    expect(dot).toHaveClass('opacity-0');
  });

  it('hides dot on the books link when viewing the blog', () => {
    mockPathname.mockReturnValue('/en-GB/blog');
    render(<Nav locale="en-GB" />);
    const booksLink = screen.getByRole('link', {name: 'books'});
    const dot = booksLink.querySelector('span');
    expect(dot).toHaveClass('opacity-0');
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
npx jest --no-coverage --testPathPattern="Nav.test"
```

Expected: FAIL — `Nav` has no dot indicator yet, so `opacity-100` / `opacity-0` assertions will fail.

- [ ] **Step 3: Implement the active dot in Nav.tsx**

Replace the entire contents of `components/Nav.tsx` with:

```tsx
'use client';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {ThemeToggle} from './ThemeToggle';
import {LanguageSwitcher} from './LanguageSwitcher';

function ActiveDot({active}: {active: boolean}) {
  return (
    <span
      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary transition-all duration-200 ${
        active ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}
    />
  );
}

export function Nav({locale}: {locale: string}) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('about');

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    if (!isHome) return;

    const ratios: Record<string, number> = {};
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ratios[entry.target.id] = entry.intersectionRatio;
        });
        const best = Object.entries(ratios).sort(([, a], [, b]) => b - a)[0];
        if (best && best[1] > 0) setActiveSection(best[0]);
      },
      {threshold: [0, 0.25, 0.5, 0.75, 1]},
    );

    ['about', 'experience', 'projects'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  const blogActive = pathname.startsWith(`/${locale}/blog`);
  const booksActive = pathname.startsWith(`/${locale}/books`);

  return (
    <motion.header
      initial={{y: -16, opacity: 0}}
      animate={{y: 0, opacity: 1}}
      transition={{duration: 0.4}}
      className="sticky top-0 z-50 border-b border-surface bg-background/90 backdrop-blur-md"
    >
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="font-serif italic text-xl text-primary leading-none">
          ag.
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider text-muted">
          <a href={`/${locale}#about`} className="relative inline-flex flex-col items-center hover:text-foreground transition-colors">
            {t('about')}
            <ActiveDot active={isHome && activeSection === 'about'} />
          </a>
          <a href={`/${locale}#experience`} className="relative inline-flex flex-col items-center hover:text-foreground transition-colors">
            {t('work')}
            <ActiveDot active={isHome && activeSection === 'experience'} />
          </a>
          <a href={`/${locale}#projects`} className="relative inline-flex flex-col items-center hover:text-foreground transition-colors">
            {t('projects')}
            <ActiveDot active={isHome && activeSection === 'projects'} />
          </a>
          <Link href={`/${locale}/blog`} className="relative inline-flex flex-col items-center hover:text-foreground transition-colors">
            {t('blog')}
            <ActiveDot active={blogActive} />
          </Link>
          <Link href={`/${locale}/books`} className="relative inline-flex flex-col items-center hover:text-foreground transition-colors">
            {t('books')}
            <ActiveDot active={booksActive} />
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

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
npx jest --no-coverage --testPathPattern="Nav.test"
```

Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Nav.tsx __tests__/components/Nav.test.tsx
git commit -m "feat: add active dot indicator to nav links"
```

---

### Task 3: Mouse-Following Hero Gradient

**Files:**
- Modify: `components/home/Hero.tsx`
- Create: `__tests__/components/Hero.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/components/Hero.test.tsx`:

```tsx
import {render, fireEvent} from '@testing-library/react';
import {Hero} from '@/components/home/Hero';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/link', () => ({
  default: ({children, href, ...props}: {children: React.ReactNode; href: string} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy({}, {
      get(_: unknown, tag: string) {
        return ({children, initial: _i, animate: _a, transition: _t, ...props}: {children?: React.ReactNode; initial?: unknown; animate?: unknown; transition?: unknown} & React.HTMLAttributes<HTMLElement>) =>
          React.createElement(tag, props, children);
      },
    }),
  };
});

describe('Hero gradient', () => {
  it('applies a radial-gradient to the section background on render', () => {
    const {container} = render(<Hero locale="en-GB" />);
    const section = container.querySelector('#about')!;
    expect(section.getAttribute('style')).toContain('radial-gradient');
  });

  it('updates the gradient position on mouse move', () => {
    const {container} = render(<Hero locale="en-GB" />);
    const section = container.querySelector('#about')! as HTMLElement;

    jest.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 1000, height: 500,
      right: 1000, bottom: 500, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);

    fireEvent.mouseMove(section, {clientX: 500, clientY: 250});

    expect(section.style.background).toContain('50.0% 50.0%');
  });

  it('resets to the default position on mouse leave', () => {
    const {container} = render(<Hero locale="en-GB" />);
    const section = container.querySelector('#about')! as HTMLElement;

    jest.spyOn(section, 'getBoundingClientRect').mockReturnValue({
      left: 0, top: 0, width: 1000, height: 500,
      right: 1000, bottom: 500, x: 0, y: 0, toJSON: () => ({}),
    } as DOMRect);

    fireEvent.mouseMove(section, {clientX: 500, clientY: 250});
    fireEvent.mouseLeave(section);

    expect(section.style.background).toContain('85.0% 10.0%');
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
npx jest --no-coverage --testPathPattern="Hero.test"
```

Expected: FAIL — the current Hero renders a static `<div>` blob and has no `radial-gradient` in the section's style attribute.

- [ ] **Step 3: Implement the mouse-following gradient in Hero.tsx**

Replace the entire contents of `components/home/Hero.tsx` with:

```tsx
'use client';
import Link from 'next/link';
import {useState} from 'react';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';

const fadeUp = (delay: number) => ({
  initial: {opacity: 0, y: 16},
  animate: {opacity: 1, y: 0},
  transition: {duration: 0.5, delay},
});

const DEFAULT_POS = {x: 85, y: 10};

export function Hero({locale}: {locale: string}) {
  const t = useTranslations('hero');
  const [pos, setPos] = useState(DEFAULT_POS);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <section
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos(DEFAULT_POS)}
      style={{
        background: `radial-gradient(circle at ${pos.x.toFixed(1)}% ${pos.y.toFixed(1)}%, rgb(var(--color-primary) / 0.15) 0%, rgb(var(--color-secondary) / 0.06) 40%, transparent 70%)`,
      }}
      className="relative px-6 py-24 max-w-4xl mx-auto overflow-hidden"
    >
      <motion.p {...fadeUp(0.1)} className="text-xs uppercase tracking-widest text-muted mb-4 font-sans">
        {t('greeting')}
      </motion.p>

      <motion.h1
        {...fadeUp(0.2)}
        className="font-serif text-6xl md:text-7xl leading-[1.0] mb-4 text-foreground"
      >
        António{' '}
        <em className="text-primary">
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

- [ ] **Step 4: Run the Hero tests to confirm they pass**

```bash
npx jest --no-coverage --testPathPattern="Hero.test"
```

Expected: PASS — 3 tests pass.

- [ ] **Step 5: Run the full test suite to check for regressions**

```bash
npx jest --no-coverage
```

Expected: PASS — all 18 tests pass (11 original + 4 Nav + 3 Hero).

- [ ] **Step 6: Commit**

```bash
git add components/home/Hero.tsx __tests__/components/Hero.test.tsx
git commit -m "feat: replace static hero blob with mouse-following radial gradient"
```