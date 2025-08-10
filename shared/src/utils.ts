export function requiredEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
