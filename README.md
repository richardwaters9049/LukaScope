# LukaScope

<p align="center">
  <img src="./docs/readme/banner.svg" alt="LukaScope Project Banner" />
</p>

<p align="center">
  <img src="./frontend/public/images/LumaScope%20Logo%204.png" alt="LukaScope Logo" width="120" />
</p>

[![Frontend: Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-0f172a?style=for-the-badge)](./frontend)
[![Backend: Express](https://img.shields.io/badge/Backend-Express-1d4ed8?style=for-the-badge)](./backend)
[![Language: TypeScript](https://img.shields.io/badge/Language-TypeScript-2563eb?style=for-the-badge)](./frontend/tsconfig.json)
[![Workspace: Bun](https://img.shields.io/badge/Workspace-Bun%201.3-0ea5e9?style=for-the-badge)](./package.json)

LukaScope is an AI-assisted blood smear analysis platform designed for fast, visual screening workflows.
This repository contains both the frontend application and backend API in a Bun workspace monorepo.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Aim](#project-aim)
- [Expected Outcomes](#expected-outcomes)
- [Current Status](#current-status)
- [Screenshots](#screenshots)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Setup and Installation](#setup-and-installation)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Environment Variables (Backend)](#environment-variables-backend)
- [API and Routes](#api-and-routes)
- [UI Pages](#ui-pages)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

LukaScope currently provides:

- A polished frontend workflow for login, dashboard, analysis simulation, result grid, and detailed result pages.
- A lightweight backend API service with security middleware and health monitoring endpoint.
- Static sample visual outputs for explainability-oriented UX demonstration.

## Project Aim

Deliver a clinician-friendly and explainable AI experience for blood smear analysis, with a strong foundation for production backend integration.

## Expected Outcomes

- Faster review workflows for uploaded samples.
- Consistent, visual reporting of confidence and cell context.
- Better trust through explainability imagery and clear result presentation.
- A clean codebase ready for iterative feature delivery.

## Current Status

| Area | Status | Notes |
|---|---|---|
| Frontend pages | Implemented | Login, dashboard, analysis overlay, results list, result detail |
| Frontend login endpoint | Implemented (MVP) | Static credential check in `frontend/app/api/login/route.ts` |
| Backend API skeleton | Implemented | Express app, middleware, health route |
| Domain APIs (auth/upload/results) | Planned | Not implemented yet |
| Persistent datastore layer | Planned | Not implemented in current cleanup state |

## Screenshots

| Branding and Context | Sample Result |
|---|---|
| <img src="./frontend/public/images/LumaScope%20Logo%204.png" alt="LukaScope Branding" width="180" /> | <img src="./frontend/public/images/sample_1P.png" alt="Sample Blood Smear Result" width="280" /> |

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
  B --> C["UI Workflows (Upload, Results, Explainability)"]
  B --> D["Backend API (Express)"]
  D --> E["Health + Middleware Layer"]
  D --> F["Domain APIs (planned)"]
```

## Tech Stack

### Frontend

- [Next.js 16](https://nextjs.org/) (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion
- shadcn/ui primitives in active use (`button`, `card`, `input`, `pagination`, `nav`)

### Backend

- Node.js + Express + TypeScript
- CORS + Helmet
- dotenv configuration

## Repository Structure

```text
LukaScope/
├── .gitignore
├── README.md
├── bun.lock
├── package.json
├── docs/
│   └── readme/
│       └── banner.svg
├── backend/
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── server/
│       ├── index.ts
│       └── config/
│           └── index.ts
└── frontend/
    ├── .gitignore
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── about/page.tsx
    │   ├── analysis/page.tsx
    │   ├── dashboard/page.tsx
    │   ├── results/page.tsx
    │   ├── results_id/page.tsx
    │   └── api/login/route.ts
    ├── components/
    │   ├── overlay.tsx
    │   ├── theme-provider.tsx
    │   └── ui/
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── nav.tsx
    │       └── pagination.tsx
    ├── lib/utils.ts
    ├── public/images/...
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    └── tsconfig.json
```

## Setup and Installation

### Prerequisites

- Node.js 20+
- Bun 1.3+

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd LukaScope
```

### 2) Install workspace dependencies

```bash
bun install
```

### 3) Configure backend environment

```bash
cp backend/.env.example backend/.env
```

## Running the Project

Run each service in its own terminal.

### Terminal A: Backend API

```bash
bun run dev:backend
```

Backend URL: `http://localhost:3001`  
Health check: `GET http://localhost:3001/health`

### Terminal B: Frontend App

```bash
bun run dev:frontend
```

Frontend URL: `http://localhost:3000`

## Available Scripts

### Root workspace (`/`)

| Command | Description |
|---|---|
| `bun run dev:frontend` | Start frontend dev server |
| `bun run dev:backend` | Start backend dev server |
| `bun run build:frontend` | Build frontend |
| `bun run build:backend` | Build backend |
| `bun run lint:frontend` | Run frontend lint |

### Package-local scripts

| Location | Command | Description |
|---|---|
| `frontend` | `bun run --cwd frontend dev` | Start Next.js dev server |
| `frontend` | `bun run --cwd frontend build` | Build frontend |
| `frontend` | `bun run --cwd frontend start` | Run frontend production server |
| `frontend` | `bun run --cwd frontend lint` | Run ESLint |
| `backend` | `bun run --cwd backend dev` | Start backend with `ts-node-dev` |
| `backend` | `bun run --cwd backend build` | Compile backend TypeScript |
| `backend` | `bun run --cwd backend start` | Run compiled backend |

## Environment Variables (Backend)

Based on [`backend/.env.example`](./backend/.env.example):

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Runtime environment | `development` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |

## API and Routes

### Implemented

- `GET /health` (backend health/status metadata)
- `POST /api/login` (frontend route handler for MVP login)

### Planned

- `/api/auth`
- `/api/upload`
- `/api/analysis`
- `/api/results`

## UI Pages

| Route | Purpose |
|---|---|
| `/` | Login screen (MVP static credential check) |
| `/dashboard` | Upload panel and project summary |
| `/analysis` | Simulated analysis overlay flow |
| `/results` | Paginated sample result grid |
| `/results_id` | Detailed single-sample result view |
| `/about` | About page placeholder |

## Future Improvements

### Near-term priorities

1. Implement backend domain route handlers (`auth`, `upload`, `analysis`, `results`).
2. Add a persistent data layer with migrations and seed workflows.
3. Replace static frontend login with backend authentication and role-based access.
4. Add API validation, error contracts, and standardized response schemas.

### Product and UX enhancements

1. Add real sample upload with progress, retry, and failure states.
2. Add filtering/search for results (date, confidence range, classification).
3. Add downloadable clinician-ready report views (PDF/CSV summaries).
4. Improve the `/about` and dashboard copy with real clinical workflow guidance.

### Engineering and quality improvements

1. Add automated tests: unit, integration, and end-to-end coverage.
2. Add CI pipeline for lint, build, and test gates before merge.
3. Add API docs (OpenAPI/Swagger) and example request/response payloads.
4. Add observability basics (structured logs, error tracking, uptime alerts).

## Contributing

1. Create a feature branch.
2. Keep changes scoped by layer (`frontend` or `backend`).
3. Run lint/build before opening a PR.
4. Update this README when behavior or setup changes.

## License

MIT (see [`backend/package.json`](./backend/package.json)).
