import { config } from '../src/config';

describe('Configuration', () => {
  it('should have port defined', () => {
    expect(config.port).toBeDefined();
    expect(typeof config.port).toBe('number');
  });

  it('should have node environment defined', () => {
    expect(config.nodeEnv).toBeDefined();
    expect(typeof config.nodeEnv).toBe('string');
  });
});
