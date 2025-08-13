import { initialState, next, turn } from '../src/scriptEngine';

describe('scriptEngine B2B installer flow', () => {
  test('happy path to scheduled demo', () => {
    let s = initialState();
    expect(s.phase).toBe('intro');

    s = next(s, 'Hi this is John from Apex Solar');
    expect(s.phase).toBe('identify');

    s = next(s, 'Yes, I run sales');
    expect(s.phase).toBe('qualify');

    s = next(s, 'We use HubSpot and work ~150 leads a month');
    expect(s.phase).toBe('pain');

    s = next(s, 'Speed to lead is tough and follow up is messy');
    expect(s.phase).toBe('value');

    s = next(s, 'sounds good');
    expect(s.phase).toBe('schedule');

    s = next(s, 'john@apex.com');
    expect(s.phase).toBe('schedule');
    s = next(s, 'Tuesday 2pm ET');
    expect(s.phase).toBe('close');

    s = next(s, 'thanks');
    expect(s.phase).toBe('done');
  });

  test('objection send info path', () => {
    let s = initialState();
    s = next(s, 'hello');
    s = next(s, 'not now, send info');
    // identify -> schedule for info exchange
    expect(['identify','schedule']).toContain(s.phase);
    s = next(s, 'ops@installer.com');
    expect(['schedule','close','done']).toContain(s.phase);
  });
});
