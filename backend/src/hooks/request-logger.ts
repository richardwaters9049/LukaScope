import type { NextFunction, Request, Response } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${durationMs}ms)`);
  });

  next();
};
