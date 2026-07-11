import type {Config} from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({dir: './'});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.worktrees/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(next-mdx-remote|remark-gfm)/)',
  ],
};

export default createJestConfig(config);
