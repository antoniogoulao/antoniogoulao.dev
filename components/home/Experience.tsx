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