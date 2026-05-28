import { buildHealthResponse } from '../src/functions/build-health-response';

describe('buildHealthResponse', () => {
  it('should return status ok', () => {
    const response = buildHealthResponse('test');
    expect(response.status).toBe('ok');
  });

  it('should include the given environment', () => {
    const response = buildHealthResponse('production');
    expect(response.environment).toBe('production');
  });

  it('should include a version string from package.json', () => {
    const response = buildHealthResponse('test');
    expect(response.version).toBeDefined();
    expect(typeof response.version).toBe('string');
    expect(response.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('should include an ISO timestamp', () => {
    const before = new Date().toISOString();
    const response = buildHealthResponse('test');
    const after = new Date().toISOString();
    expect(response.timestamp >= before).toBe(true);
    expect(response.timestamp <= after).toBe(true);
  });
});
