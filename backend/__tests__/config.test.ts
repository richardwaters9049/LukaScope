import { config } from '../src/config';

describe('Configuration', () => {
  it('should have port defined as a number', () => {
    expect(config.port).toBeDefined();
    expect(typeof config.port).toBe('number');
  });

  it('should have node environment defined as a string', () => {
    expect(config.nodeEnv).toBeDefined();
    expect(typeof config.nodeEnv).toBe('string');
  });

  it('should have frontendUrl defined', () => {
    expect(config.frontendUrl).toBeDefined();
  });

  it('should default port to 3001 when PORT env is not set', () => {
    expect(config.port).toBe(3001);
  });
});
