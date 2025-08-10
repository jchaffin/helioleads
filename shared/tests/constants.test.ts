import { SOURCES, isSource } from '../src';

describe('SOURCES constants', () => {
  test('has expected keys and values', () => {
    expect(SOURCES.Scraper).toBe('scraper');
    expect(SOURCES.Twilio).toBe('twilio');
    expect(SOURCES.Dialer).toBe('dialer');
  });

  test('isSource type guard works', () => {
    expect(isSource('scraper')).toBe(true);
    expect(isSource('unknown')).toBe(false);
  });
});

