export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    title: 'Software Engineer',
    company: 'Uphill Health - PT',
    period: '2024 — Present',
    description: 'Building mobile and web health applications with React Native and Next.js. Focused on clean architecture, performance, and great user experiences.',
  },
  {
    title: 'Mobile Developer',
    company: 'Collibra NV - BE',
    period: '2018 — 2024',
    description: 'Developed cross-platform mobile applications using React Native. Worked closely with design and product teams to deliver polished iOS and Android experiences.',
  },
  {
    title: 'Frontend Developer',
    company: 'Celfocus S.A. - PT',
    period: '2015 — 2018',
    description: 'Built responsive applications for Android STBs with Java. Contributed to component libraries and improved developer tooling.',
  },
];