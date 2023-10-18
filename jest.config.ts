import { createConfig } from '@umijs/test';

import type { Config } from '@umijs/test';

export default {
  ...createConfig(),
  testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
} as Config.InitialOptions;
