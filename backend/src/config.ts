import "dotenv/config";

const parsePort = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  port: parsePort(process.env.PORT, 3001),
  nodeEnv: process.env.NODE_ENV ?? "development",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
} as const;
