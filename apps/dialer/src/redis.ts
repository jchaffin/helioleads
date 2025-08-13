import { RedisOptions } from 'ioredis';

export function redisConnection(): RedisOptions {
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = Number(process.env.REDIS_PORT || 6379);
  const password = process.env.REDIS_PASSWORD || undefined;
  const tls = (process.env.REDIS_TLS || '').toLowerCase();
  const useTLS = tls === '1' || tls === 'true' || tls === 'yes';

  const opts: RedisOptions = { host, port } as RedisOptions;
  if (password) (opts as any).password = password;
  if (useTLS) (opts as any).tls = {};
  return opts;
}

