import { apiLimiter } from '../src/hooks/rate-limiter';

describe('apiLimiter', () => {
  it('should be a function (middleware)', () => {
    expect(typeof apiLimiter).toBe('function');
  });
});
