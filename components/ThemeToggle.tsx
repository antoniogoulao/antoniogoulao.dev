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