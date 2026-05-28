# Development Notes

## 28 May 2026

### Backend Technical Debt — Audit & Remediation

Conducted a full review of the `backend/` folder and resolved 16 identified issues:

1. **Input validation** — Added `zod` with a reusable `validate` middleware hook for request body schemas.
2. **Structured logging** — Replaced bare `console.log`/`console.error` calls with `pino`, providing JSON-structured output, log levels, and contextual metadata.
3. **Hardcoded version** — `build-health-response.ts` now reads the version from `package.json` rather than a string literal.
4. **Rate limiting** — Added `express-rate-limit` middleware (100 requests per 15-minute window) to protect against abuse.
5. **Graceful shutdown** — Extended signal handling to cover both `SIGTERM` and `SIGINT`, with a 10-second drain timeout to prevent hung processes.
6. **Error handler typing** — Changed the error middleware parameter from `Error` to `unknown` with a runtime `instanceof` check, preventing crashes from non-Error throws.
7. **Multiple CORS origins** — `FRONTEND_URL` now supports comma-separated values (e.g. `http://localhost:3000,https://staging.example.com`).
8. **Backend linter** — Added ESLint with `@typescript-eslint` to the backend workspace and a `lint:backend` script to the root `package.json`.
9. **Expanded test suites** — Added tests for the health response builder, rate limiter, validation middleware, config defaults, `dataset_hook.py`, and `preprocess_images.py`.
10. **Pinned AI dependencies** — All entries in `requirements.txt` now specify exact versions for reproducible builds.
11. **Dead `skipped` counter** — `preprocess_images.py` now correctly increments the `skipped` counter for non-image files.
12. **Dockerfile — deduplicated Bun install** — Moved the `npm install -g bun` step into the shared `base` stage so it is inherited by all downstream stages.
13. **Dockerfile — removed source from production image** — The runner stage no longer copies `backend/src`, reducing image size and avoiding information leakage.
14. **Dockerfile — removed baked `.env`** — Stopped copying `.env.example` as `.env` into the production image; environment is now injected at runtime only.
15. **API routing layer** — Introduced `src/routes/` with an Express Router, starting with the health endpoint. New routes can be added without bloating `index.ts`.
16. **Missing `__init__.py` files** — Added `__init__.py` to `hooks/`, `functions/`, and `tests/` in the Python AI workspace for proper module resolution.
