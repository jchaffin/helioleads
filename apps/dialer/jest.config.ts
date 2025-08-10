import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] }
};
export default config;