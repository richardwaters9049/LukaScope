import type { NextFunction, Request, Response } from "express";
import { logger } from "../functions/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    logger.info(
      { method: req.method, path: req.path, statusCode: res.statusCode, durationMs },
      `${req.method} ${req.path} - ${res.statusCode} (${durationMs}ms)`,
    );
  });

  next();
};
