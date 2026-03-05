import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config";
import { buildHealthResponse } from "./functions/build-health-response";
import { requestLogger } from "./hooks/request-logger";

const app: Express = express();

app.use(
  helmet({
    contentSecurityPolicy: config.nodeEnv === "production" ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);

app.get("/health", (_req: Request, res: Response) => {
  res.json(buildHealthResponse(config.nodeEnv));
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: config.nodeEnv === "development" ? err.message : "An unexpected error occurred",
  });
});

const server = app.listen(config.port, () => {
  console.log(`LukaScope backend listening on http://localhost:${config.port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

export default app;
