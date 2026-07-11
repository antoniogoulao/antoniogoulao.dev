import {useTranslations} from 'next-intl';
import {SectionDivider} from '@/components/SectionDivider';

const groups = [
  {
    key: 'mobile',
    items: ['React Native', 'Expo (EAS)', 'iOS (Swift 5)', 'Android', 'MMKV', 'AsyncStorage', 'Maestro', 'Store release pipelines'],
  },
  {
    key: 'frontend',
    items: ['React', 'TypeScript', 'GraphQL', 'React Query', 'Zustand', 'Redux', 'Material UI', 'Electron'],
  },
  {
    key: 'tooling',
    items: ['Jest', 'Maestro', 'Playwright', 'Sentry', 'Firebase', 'Reactotron', 'CI/CD', 'AI-assisted development (Claude Code, Codex)'],
  },
];

export function Skills() {
  const t = useTranslations('skills');
  const ts = useTranslations('sections');

  return (
    <section id="skills" className="px-6 py-12 max-w-4xl mx-auto">
      <SectionDivider label={ts('skills')} />
      <div className="grid sm:grid-cols-3 gap-8">
        {groups.map(group => (
          <div key={group.key}>
            <h3 className="text-xs uppercase tracking-widest text-secondary mb-3 font-sans">
              {t(group.key)}
            </h3>
            <ul className="space-y-1.5">
              {group.items.map(item => (
                <li key={item} className="text-muted text-sm font-sans">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
