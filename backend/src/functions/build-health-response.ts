import { version } from "../../package.json";

export const buildHealthResponse = (environment: string) => ({
  status: "ok",
  environment,
  version,
  timestamp: new Date().toISOString(),
});
