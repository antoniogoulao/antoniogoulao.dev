export interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  description: string;
}

export const experience: ExperienceEntry[] = [
  {
    title: 'Software Engineer',
    company: 'Uphill Health',
    period: '2022 — Present',
    description: 'Building mobile and web health applications with React Native and Next.js. Focused on clean architecture, performance, and great user experiences.',
  },
  {
    title: 'Mobile Developer',
    company: 'Previous Company',
    period: '2020 — 2022',
    description: 'Developed cross-platform mobile applications using React Native. Worked closely with design and product teams to deliver polished iOS and Android experiences.',
  },
  {
    title: 'Frontend Developer',
    company: 'Earlier Company',
    period: '2018 — 2020',
    description: 'Built responsive web applications with React. Contributed to component libraries and improved developer tooling.',
  },
];