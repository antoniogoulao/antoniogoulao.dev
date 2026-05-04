# Design: Active Nav Indicator + Mouse-Following Hero Gradient

**Date:** 2026-05-04
**Status:** Approved

---

## Overview

Two independent UI enhancements to the personal website:

1. **Active nav indicator** — a small orange dot below the nav link corresponding to the current page or visible section.
2. **Mouse-following hero gradient** — the decorative background gradient in the Hero section tracks the cursor, replacing the static blob.

---

## Feature 1: Active Nav Indicator

### Behaviour

- **Route links** (`/blog`, `/books`): active when `usePathname()` starts with `/${locale}/blog` or `/${locale}/books`.
- **Anchor links** (`#about`, `#experience`, `#projects`): active only on the home page, determined by an `IntersectionObserver` watching each section with a `0.5` threshold. The section with the highest intersection ratio wins.
- Only one link is ever active at a time.
- On pages other than home, anchor links are never marked active.

### Visual

- Each link is wrapped in a `<span className="relative inline-flex flex-col items-center">`.
- The dot is a child `<span>` — `w-1.5 h-1.5 rounded-full bg-primary absolute -bottom-2` — toggled between `opacity-0 scale-50` and `opacity-100 scale-100` with `transition-all duration-200`.

### Files changed

- `components/Nav.tsx` — add `usePathname`, `useState`, `useEffect` with `IntersectionObserver`.

---

## Feature 2: Mouse-Following Hero Gradient

### Behaviour

- The static decorative `<div>` (the blurred circle, `absolute -top-20 -right-20 ...`) is removed.
- Mouse position is tracked as `{ x: number, y: number }` percentages relative to the `<section>` bounding rect via `onMouseMove`.
- Default position: `{ x: 85, y: 10 }` — approximates the original top-right blob location, so the hero looks the same on page load and after the mouse leaves.
- `onMouseLeave` resets state to the default position.
- The gradient is applied as an inline `style` on the `<section>`:
  ```
  radial-gradient(circle at X% Y%, rgb(var(--color-primary) / 0.15) 0%, rgb(var(--color-secondary) / 0.06) 40%, transparent 70%)
  ```
- Uses the existing CSS custom properties (`--color-primary`, `--color-secondary`) so it automatically adapts to light and dark mode.
- No CSS transition on the gradient itself (browsers cannot interpolate gradient positions). The follow feels immediate and direct, which is the intended effect.

### Files changed

- `components/home/Hero.tsx` — remove static blob div, add `useState`, `useRef`, `onMouseMove`/`onMouseLeave` handlers, inline `style` on `<section>`.

---

## Constraints

- Both changes are purely cosmetic — no data fetching, no routing changes, no new dependencies.
- Both components are already `'use client'`.
- The `IntersectionObserver` in Nav must be set up only when on the home page (pathname === `/${locale}`) to avoid querying non-existent DOM nodes on other pages.
- `IntersectionObserver` must be cleaned up in the `useEffect` return.