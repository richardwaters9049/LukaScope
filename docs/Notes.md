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

---

### Frontend Technical Debt — Audit & Remediation

Conducted a full review of the `frontend/` folder and resolved 19 identified issues:

1. **Route protection** — Added Next.js middleware (`middleware.ts`) that checks the session cookie and redirects unauthenticated users to the login page for all protected routes (`/dashboard`, `/results`, `/profile`, `/about`).
2. **Hardcoded demo credentials removed from UI** — Login form fields now start empty with neutral placeholders instead of pre-filling the demo email and password.
3. **localStorage auth state** — Retained for display-name convenience but route protection is now enforced server-side via the session cookie in middleware.
4. **Uncaught fetch errors on login** — Wrapped the login `fetch` call in a `try/catch` so network failures display a user-friendly error message.
5. **Login API input validation** — Added `try/catch` around `req.json()` and explicit type checks for `email` and `password` fields, returning 400 for malformed or missing data.
6. **Metadata description** — Updated from the generic "Web app" to a meaningful description for SEO and link previews.
7. **Logo filename** — Renamed `LumaScope Logo 4.png` (spaces + typo) to `lukascope-logo.png` and updated all references.
8. **Overused `priority` prop** — Removed `priority` from result-grid images; only above-the-fold images retain the hint.
9. **Shared animation variants** — Extracted duplicated `pageVariants` and `itemVariants` from `about/page.tsx` and `profile/page.tsx` into `lib/animations.ts`.
10. **About page monolith** — Split the 506-line about page into a lean page component and a separate `data.ts` module containing all data arrays.
11. **Raw HTML form elements** — Replaced native `<select>` and `<input type="checkbox">` in the profile page with shadcn/ui `Input` components for visual consistency.
12. **Loading and error boundaries** — Added `app/loading.tsx` and `app/error.tsx` so users see a spinner or recovery UI instead of blank screens.
13. **Expanded test suite** — Grew from 1 test to 23 across four test files covering the login page, auth utilities, results data integrity, and login validation logic. Added proper mocks for `useRouter` and `framer-motion`.
14. **AGENTS.md `/analysis` route** — Corrected the documentation to reflect that the analysis overlay is embedded in `/dashboard`, not a separate route.
15. **Redundant type assertion** — Removed the unnecessary `as keyof typeof` cast in the results detail page.
16. **Mock explainability images** — Added a TODO comment noting that all samples currently share the same image paths and will need per-sample assets.
17. **Consistent export style** — Standardised all page and component exports to use `export default function` instead of a mix of `const` + bottom-level `export default`.
18. **robots.txt** — Added `public/robots.txt` for search-engine discoverability.
19. **Dockerfile double install** — Removed the redundant `bun install` from the dev stage that was already covered by the deps stage.
