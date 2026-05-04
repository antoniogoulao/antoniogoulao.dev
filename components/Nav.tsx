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