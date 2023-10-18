import { createConfig } from '@umijs/test';

import type { Config } from '@umijs/test';

export default {
  ...createConfig(),
  testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    '**/src/**/*.{ts,tsx}',
    '!**/examples/**/*.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
} as Config.InitialOptions;
