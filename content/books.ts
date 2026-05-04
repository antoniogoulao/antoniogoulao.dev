export interface Book {
  title: string;
  author: string;
  year: number;
  note?: string;
}

export const books: Book[] = [
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    year: 2024,
    note: 'Essential reading for any engineer.',
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2024,
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    year: 2023,
    note: 'Changed how I think about building routines.',
  },
  {
    title: 'The Phoenix Project',
    author: 'Gene Kim, Kevin Behr & George Spafford',
    year: 2023,
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    year: 2022,
    note: 'Convinced me to protect blocks of focused time.',
  },
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    year: 2022,
  },
];