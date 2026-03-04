# LukaScope

<p align="center">
  <img src="./docs/readme/banner.svg" alt="LukaScope Project Banner" />
</p>

<p align="center">
  <img src="./frontend/public/images/LumaScope%20Logo%204.png" alt="LukaScope Logo" width="120" />
</p>

[![Frontend: Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-0f172a?style=for-the-badge)](./frontend)
[![Backend: Express + Prisma](https://img.shields.io/badge/Backend-Express%20%2B%20Prisma-1d4ed8?style=for-the-badge)](./backend)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-0ea5e9?style=for-the-badge)](./backend/prisma/schema.prisma)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-2563eb?style=for-the-badge)](./frontend/tsconfig.json)

LukaScope is an AI-assisted blood smear analysis platform designed to support leukemia screening workflows.  
This repository contains both the **frontend clinician interface** and the **backend API/data layer**.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Aim](#project-aim)
- [Expected Outcomes](#expected-outcomes)
- [Current Implementation Status](#current-implementation-status)
- [Screenshots](#screenshots)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Environment Variables (Backend)](#environment-variables-backend)
- [API and Routes](#api-and-routes)
- [Authentication](#authentication)
- [Data Model (Prisma)](#data-model-prisma)
- [UI Pages](#ui-pages)
- [Security Notes](#security-notes)
- [Known Gaps and Roadmap](#known-gaps-and-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

LukaScope combines computer vision and explainable AI concepts into a web application workflow for blood sample assessment. The platform is structured as:

- **Frontend (`/frontend`)**: Next.js app with login, dashboard, upload flow, results list, and detailed result view.
- **Backend (`/backend`)**: Express + Prisma API foundation with authentication service, middleware, config management, and PostgreSQL schema.

The product direction is to provide clear sample-level outputs:

- Classification (e.g., positive/negative indicator)
- Confidence score
- Cell count breakdown
- Explainability visualizations (e.g., SHAP/gradient overlays)

## Project Aim

The primary aim of LukaScope is to deliver a reliable, transparent, and clinician-friendly interface for AI-assisted blood smear analysis, reducing manual triage time while preserving interpretability and traceability.

## Expected Outcomes

- Faster pre-screening and triage support for clinicians/lab teams
- Standardized reporting across uploaded samples
- Explainable AI outputs to improve trust and auditability
- Historical tracking of analysis events and outcomes per sample
- Secure, role-aware access to patient/sample analysis workflows

## Current Implementation Status

| Area | Status | Notes |
|---|---|---|
| Frontend app shell and pages | Implemented | Login, dashboard, analysis simulation, results grid, single result page |
| Frontend auth guard | Implemented (MVP) | Cookie-based session check in `frontend/app/proxy.ts` |
| Frontend login API | Implemented (MVP) | Static credential check in `frontend/app/api/login/route.ts` |
| Backend Express server | Implemented | Health endpoint, middleware stack, route mounting points |
| Backend authentication service | Implemented | JWT generation/verification and user auth service logic |
| Prisma schema | Implemented | Users, analyses, files, history, cell counts |
| Backend API route handlers | In progress | `backend/server/routes` directory exists but route files are currently missing |

## Screenshots

> Current visuals are from the active demo flow and explainability assets.

| Login and Dashboard Context | Sample Result |
|---|---|
| <img src="./frontend/public/images/LumaScope%20Logo%204.png" alt="LukaScope Login Branding" width="180" /> | <img src="./frontend/public/images/sample_1P.png" alt="Sample Blood Smear Result" width="280" /> |

| SHAP Explainability Heatmap | Gradient Explainability Heatmap |
|---|---|
| <img src="./frontend/public/images/shap_heatmap.png" alt="SHAP Explainability" width="380" /> | <img src="./frontend/public/images/gradient_heatmap.png" alt="Gradient Explainability" width="380" /> |

| Guided Backpropagation |
|---|
| <img src="./frontend/public/images/guided_backprop.png" alt="Guided Backprop Explainability" width="420" /> |

## System Architecture

```mermaid
flowchart LR
  A["Clinician / User"] --> B["Next.js Frontend (App Router)"]
  B --> C["Auth Cookie Guard"]
  B --> D["UI Workflows (Upload, Results, Explainability)"]
  B --> E["Backend API (Express)"]
  E --> F["Auth Service (JWT + bcrypt)"]
  E --> G["Prisma ORM"]
  G --> H["PostgreSQL"]
  E --> I["AI Service (planned / external)"]
  E --> J["S3 Storage (optional)"]
```

## Tech Stack

### Frontend

- [Next.js 16](https://nextjs.org/) (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Radix UI + shadcn/ui components
- Framer Motion animations

### Backend

- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- Zod request validation
- Helmet + CORS middleware

## Repository Structure

```text
LukaScope/
├── README.md
├── docs/
│   └── readme/
│       └── banner.svg
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── notes.md
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── server/
│       ├── index.ts
│       ├── config/
│       │   ├── auth.ts
│       │   ├── database.ts
│       │   └── index.ts
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   └── validation.middleware.ts
│       ├── routes/               # Mount points exist; handlers currently missing
│       └── services/
│           └── auth.service.ts
└── frontend/
    ├── .gitignore
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── proxy.ts
    │   ├── about/page.tsx
    │   ├── analysis/page.tsx
    │   ├── dashboard/page.tsx
    │   ├── results/page.tsx
    │   ├── results_id/page.tsx
    │   └── api/login/route.ts
    ├── components/
    │   ├── overlay.tsx
    │   ├── results.tsx
    │   ├── theme-provider.tsx
    │   └── ui/...
    ├── hooks/use-mobile.ts
    ├── lib/utils.ts
    ├── public/
    │   ├── images/...
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── bun.lock
    └── package-lock.json
```

## Setup and Installation

### Prerequisites

- Node.js 20+
- npm 10+ (or Bun, if preferred for frontend)
- PostgreSQL 14+

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd LukaScope
```

### 2) Install frontend dependencies

```bash
cd frontend
npm install
```

### 3) Install backend dependencies

```bash
cd ../backend
npm install
```

### 4) Configure backend environment

```bash
cp .env.example .env
```

Edit `.env` with your local database credentials and secure secrets.

### 5) Generate Prisma client and run migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Running the Project

Run each service in its own terminal.

### Terminal A: Backend

```bash
cd backend
npm run dev
```

Backend default URL: `http://localhost:3001`  
Health check: `GET http://localhost:3001/health`

### Terminal B: Frontend

```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:3000`

## Available Scripts

### Frontend (`/frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Starts Next.js development server |
| `npm run build` | Creates production build |
| `npm run start` | Runs production server |
| `npm run lint` | Runs ESLint |

### Backend (`/backend`)

| Command | Description |
|---|---|
| `npm run dev` | Starts Express API with `ts-node-dev` |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm run start` | Starts compiled backend from `dist/server/index.js` |
| `npm run prisma:generate` | Generates Prisma client |
| `npm run prisma:migrate` | Runs Prisma migration workflow |
| `npm run prisma:studio` | Opens Prisma Studio |
| `npm run prisma:seed` | Runs seed script (`prisma/seed.ts`) if present (currently not included) |

## Environment Variables (Backend)

Based on [`backend/.env.example`](./backend/.env.example):

| Variable | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/lukascope` |
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Runtime environment | `development` |
| `FRONTEND_URL` | CORS allowed frontend origin | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | `change-this` |
| `JWT_EXPIRES_IN` | Token validity window | `24h` |
| `AWS_REGION` | Optional AWS region for storage | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Optional AWS credentials | `...` |
| `AWS_SECRET_ACCESS_KEY` | Optional AWS credentials | `...` |
| `S3_BUCKET` | Optional bucket for sample files | `lukascope-samples` |
| `AI_SERVICE_URL` | URL for inference service | `http://localhost:8000` |
| `MODEL_VERSION` | Version label for model output | `YOLOv8n+XGBoost-v1.2` |
| `BCRYPT_ROUNDS` | Password hashing cost | `10` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## API and Routes

### Implemented now

- `GET /health` (backend server health and metadata)
- `POST /api/login` (frontend route handler, static credentials for MVP)

### Planned backend mounts (already wired in `backend/server/index.ts`)

- `/api/auth`
- `/api/upload`
- `/api/analysis`
- `/api/results`

Note: corresponding route handler files are not yet present in `backend/server/routes`.

## Authentication

### Current MVP behavior

- Frontend login currently uses static credentials:
  - Email: `admin@lukascope.com`
  - Password: `password123`
- Session cookie is set client-side for protected route access.
- Protected prefixes in frontend: `/dashboard`, `/results`.

### Backend-ready auth foundation

- JWT generation and verification
- Password hashing via bcrypt
- Auth middleware (`authenticate`, `authorize`, `optionalAuth`)
- User role model in database (`ADMIN`, `CLINICIAN`, `RESEARCHER`)

## Data Model (Prisma)

Key entities in [`backend/prisma/schema.prisma`](./backend/prisma/schema.prisma):

- `User`: account, role, activation status
- `Analysis`: sample-level prediction, status, confidence, model version
- `CellCount`: per-analysis cell metrics
- `File`: original/annotated/heatmap artifact metadata
- `AnalysisHistory`: event timeline and metadata trail

Enums include:

- `UserRole`: `ADMIN`, `CLINICIAN`, `RESEARCHER`
- `AnalysisStatus`: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`
- `FileType`: `ORIGINAL`, `ANNOTATED`, `HEATMAP`, `GRADIENT`, `SHAP`, `THUMBNAIL`

## UI Pages

| Route | Purpose |
|---|---|
| `/` | Login screen (MVP credential check) |
| `/dashboard` | Intro + upload panel |
| `/analysis` | Simulated analysis flow with staged overlay |
| `/results` | Paginated result cards |
| `/results_id` | Detailed single-sample analysis view |
| `/about` | About page placeholder content |

## Security Notes

- JWT secret in development defaults should be replaced in production.
- Static demo credentials are for MVP/testing only.
- Ensure secure cookie strategy (`httpOnly`, `secure`, `sameSite`) for production auth flows.
- Add backend rate limiting middleware implementation to match config values.

## Known Gaps and Roadmap

### High-priority next steps

1. Implement missing backend route handlers in `backend/server/routes`.
2. Connect frontend upload/results flows to backend API instead of static mock data.
3. Replace static frontend login with backend `/api/auth/login` integration.
4. Add file storage pipeline (S3/local) for uploaded samples and generated explainability artifacts.
5. Add test coverage (unit + integration + e2e) and CI checks.

### Suggested quality improvements

1. Introduce OpenAPI/Swagger docs for backend contracts.
2. Add request-level rate limiting and structured logging.
3. Add role-based UI controls and audit trail views.
4. Add Docker-based local orchestration for frontend, backend, DB, and AI service.

## Contributing

1. Create a feature branch.
2. Keep changes scoped by layer (`frontend` or `backend`).
3. Run lint/build before opening a PR.
4. Document new environment variables and API changes in this README.

## License

MIT (see `backend/package.json`).
