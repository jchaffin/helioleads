import { requiredEnv, sleep } from '../src';

describe('utils', () => {
  const ENV_KEY = 'TEST_REQUIRED_ENV_KEY';

  afterEach(() => {
    delete (process.env as any)[ENV_KEY];
  });

  test('requiredEnv throws when missing', () => {
    expect(() => requiredEnv(ENV_KEY)).toThrow(/Missing required env/);
  });

  test('requiredEnv returns value when present', () => {
    (process.env as any)[ENV_KEY] = 'ok';
    expect(requiredEnv(ENV_KEY)).toBe('ok');
  });

  test('sleep resolves after approx delay', async () => {
    const start = Date.now();
    await sleep(20);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(15);
  });
});

