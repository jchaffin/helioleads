export const SOURCES = {
  Scraper: 'scraper',
  Manual: 'manual',
  Import: 'import',
  Referral: 'referral',
  Website: 'website',
  Ads: 'ads',
  Outbound: 'outbound',
  Inbound: 'inbound',
  Twilio: 'twilio',
  Dialer: 'dialer',
  Dashboard: 'dashboard',
} as const;

export type Source = typeof SOURCES[keyof typeof SOURCES];

export function isSource(value: string): value is Source {
  return Object.values(SOURCES).includes(value as Source);
}

