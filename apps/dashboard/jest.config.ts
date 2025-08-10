import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' }
};
export default config;