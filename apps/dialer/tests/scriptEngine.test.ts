import { initialState, next } from '../src/scriptEngine';

describe('scriptEngine', () => {
  test('progresses through phases in order', () => {
    let s = initialState();
    expect(s.phase).toBe('intro');
    s = next(s, 'hello');
    expect(s.phase).toBe('qualify');
    s = next(s, 'answer');
    expect(s.phase).toBe('pitch');
    s = next(s, 'interested');
    expect(s.phase).toBe('close');
    s = next(s, 'goodbye');
    expect(s.phase).toBe('done');
  });
});
