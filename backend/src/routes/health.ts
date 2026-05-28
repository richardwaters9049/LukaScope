import { Router, type Request, type Response } from "express";
import { buildHealthResponse } from "../functions/build-health-response";
import { config } from "../config";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json(buildHealthResponse(config.nodeEnv));
});

export default router;
