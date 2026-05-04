'use client';
import Link from 'next/link';
import {useRef, useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';

const fadeUp = (delay: number) => ({
  initial: {opacity: 0, y: 16},
  animate: {opacity: 1, y: 0},
  transition: {duration: 0.5, delay},
});

const DEFAULT_POS = {x: 85, y: 10};

function gradientStyle(x: number, y: number): string {
  return `radial-gradient(circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgb(var(--color-primary) / 0.15) 0%, rgb(var(--color-secondary) / 0.06) 40%, transparent 70%)`;
}

export function Hero({locale}: {locale: string}) {
  const t = useTranslations('hero');
  const [pos, setPos] = useState(DEFAULT_POS);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.setAttribute(
        'style',
        `background: ${gradientStyle(pos.x, pos.y)}`,
      );
    }
  }, [pos]);

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
      ref={sectionRef}
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos(DEFAULT_POS)}
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