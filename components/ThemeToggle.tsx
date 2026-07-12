'use client';
import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';

export function ThemeToggle() {
  const {resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  // One-time mount flag to avoid a hydration mismatch on the theme icon.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" aria-hidden="true" />;

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors"
      aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={resolvedTheme === 'dark'}
    >
      <span aria-hidden="true">{resolvedTheme === 'dark' ? '☀' : '🌙'}</span>
    </button>
  );
}