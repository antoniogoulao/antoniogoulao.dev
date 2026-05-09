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

    ['about', 'experience', 'projects', 'contact'].forEach(id => {
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
          <a href={`/${locale}#contact`} className="relative inline-flex flex-col items-center hover:text-foreground transition-colors">
            {t('contact')}
            <ActiveDot active={isHome && activeSection === 'contact'} />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}