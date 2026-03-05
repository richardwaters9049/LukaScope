export const buildHealthResponse = (environment: string) => ({
  status: "ok",
  environment,
  version: "1.0.0",
  timestamp: new Date().toISOString(),
});
