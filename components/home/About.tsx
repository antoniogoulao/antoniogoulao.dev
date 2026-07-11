import {useTranslations} from 'next-intl';
import {SectionDivider} from '@/components/SectionDivider';

export function About() {
  const t = useTranslations('about');
  const ts = useTranslations('sections');

  return (
    <section id="about" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={ts('about')} />
      <div className="space-y-4 max-w-2xl">
        <p className="text-muted leading-relaxed font-sans">{t('p1')}</p>
        <p className="text-muted leading-relaxed font-sans">{t('p2')}</p>
        <p className="text-muted leading-relaxed font-sans">{t('p3')}</p>
      </div>
    </section>
  );
}
