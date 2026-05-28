import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config";
import { logger } from "./functions/logger";
import { requestLogger } from "./hooks/request-logger";
import { apiLimiter } from "./hooks/rate-limiter";
import routes from "./routes";

const SHUTDOWN_TIMEOUT_MS = 10_000;

const app: Express = express();

app.use(
  helmet({
    contentSecurityPolicy: config.nodeEnv === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(apiLimiter);
app.use(requestLogger);

app.use(routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "An unexpected error occurred";
  logger.error({ err }, "Unhandled error");

  res.status(500).json({
    error: "Internal Server Error",
    message: config.nodeEnv === "development" ? message : "An unexpected error occurred",
  });
});

const server = app.listen(config.port, () => {
  logger.info(`LukaScope backend listening on http://localhost:${config.port}`);
});

const shutdown = () => {
  logger.info("Shutting down gracefully...");
  server.close(() => process.exit(0));
  setTimeout(() => {
    logger.warn("Shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
