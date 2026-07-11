export interface ExperienceEntry {
  key: string;
  title: string;
  company: string;
  period: string;
  current?: boolean;
  tags?: string[];
}

export const experience: ExperienceEntry[] = [
  {
    key: 'uphill',
    title: 'Senior Mobile & Frontend Developer',
    company: 'UpHill, S.A. — Lisbon',
    period: 'Mar 2024',
    current: true,
    tags: ['React Native', 'Expo (EAS)', 'TypeScript', 'Zustand', 'React Query', 'MMKV', 'Jest', 'Maestro', 'Playwright'],
  },
  {
    key: 'collibra',
    title: 'Senior Mobile & Frontend Developer',
    company: 'Collibra — Brussels',
    period: '2018 — 2024',
    tags: ['React Native', 'Expo', 'iOS (Swift 5)', 'React', 'GraphQL', 'React Query', 'Material UI', 'Electron'],
  },
  {
    key: 'celfocus',
    title: 'Consultant',
    company: 'Celfocus S.A. — Lisbon',
    period: '2015 — 2018',
    tags: ['Android', 'Java EE', 'React', 'AWS'],
  },
  {
    key: 'premiumMinds',
    title: 'Summer Intern',
    company: 'Premium Minds — Lisbon',
    period: '2013',
  },
];
