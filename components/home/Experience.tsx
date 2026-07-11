'use client';
import {useRef} from 'react';
import {motion, useInView} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {experience, type ExperienceEntry} from '@/content/experience';
import {SectionDivider} from '@/components/SectionDivider';

function EntryRow({entry, index, tExp}: {entry: ExperienceEntry; index: number; tExp: ReturnType<typeof useTranslations>}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {once: true, margin: '-60px'});
  const description = tExp.raw(entry.key) as string | string[];

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
        <p className="text-muted text-xs mt-0.5 mb-2 font-sans">
          {entry.current ? `${entry.period} — ${tExp('present')}` : entry.period}
        </p>
        {Array.isArray(description) ? (
          <ul className="list-disc list-inside text-muted text-sm leading-relaxed font-sans space-y-1">
            {description.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm leading-relaxed font-sans">{description}</p>
        )}
        {entry.tags && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.map(tag => (
              <span
                key={tag}
                className="text-xs text-muted bg-surface rounded px-2 py-0.5 font-sans"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function Experience() {
  const t = useTranslations('sections');
  const tExp = useTranslations('experience');

  return (
    <section id="experience" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={t('experience')} />
      <div>
        {experience.map((entry, i) => (
          <EntryRow key={entry.key} entry={entry} index={i} tExp={tExp} />
        ))}
      </div>
      <div className="mt-4 pt-6 border-t border-surface">
        <p className="text-xs uppercase tracking-widest text-muted mb-1 font-sans">
          {tExp('educationLabel')}
        </p>
        <p className="text-foreground text-sm font-sans">{tExp('education')}</p>
      </div>
    </section>
  );
}