# LukaScope

<p align="center">
  <img src="./docs/banner.svg" alt="LukaScope Project Banner" />
</p>

<p align="center">
  <img src="./frontend/public/images/LumaScope%20Logo%204.png" alt="LukaScope Logo" width="120" />
</p>

<p align="center">
  <a href="./frontend"><img src="https://img.shields.io/badge/Frontend-Next.js%2016-111827?style=for-the-badge&labelColor=0f172a&color=1f2937" alt="Frontend: Next.js 16" /></a>
  <a href="./backend"><img src="https://img.shields.io/badge/Backend-Express-1d4ed8?style=for-the-badge&labelColor=1e3a8a&color=3b82f6" alt="Backend: Express" /></a>
  <a href="./frontend/tsconfig.json"><img src="https://img.shields.io/badge/Language-TypeScript-2563eb?style=for-the-badge&labelColor=1d4ed8&color=60a5fa" alt="Language: TypeScript" /></a>
  <a href="./package.json"><img src="https://img.shields.io/badge/Workspace-Bun%201.3-0284c7?style=for-the-badge&labelColor=0369a1&color=38bdf8" alt="Workspace: Bun" /></a>
</p>

<h2 align="center">AI-Assisted Leukemia Detection Platform</h2>
<h3 align="center">Earlier flagging • Faster screening support • More consistent clinical review</h3>

LukaScope is an AI-powered blood smear analysis platform designed to help clinicians detect potential leukemia **earlier, faster, and more consistently**.
As the model is trained on larger and more diverse datasets, the system is expected to improve sensitivity, robustness, and confidence calibration for earlier suspicious-case flagging and clinical review.
This repository contains both the frontend application and backend API in a Bun workspace monorepo.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Aim](#project-aim)
- [Expected Outcomes](#expected-outcomes)
- [Current Status](#current-status)
- [AI Datasets and Training Plan](#ai-datasets-and-training-plan)
- [Training Methods and Model Strategy](#training-methods-and-model-strategy)
- [How Python Trains the AI](#how-python-trains-the-ai)
- [Screenshots](#screenshots)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Workspace Dependency Model (Bun)](#workspace-dependency-model-bun)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [Testing Strategy](#testing-strategy)
- [Environment Variables (Backend)](#environment-variables-backend)
- [API and Routes](#api-and-routes)
- [UI Pages](#ui-pages)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

LukaScope currently provides:

- A polished frontend workflow for login, dashboard, analysis simulation, result grid, and detailed result pages.
- A lightweight backend API service with security middleware and health monitoring endpoint in `backend/src`.
- A dedicated Python AI training workspace in `backend/ai` for dataset prep, preprocessing, and model training.
- A clear folder convention where both API and AI layers use `hooks/` and `functions/` for maintainability.
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

## AI Datasets and Training Plan

The following publicly available datasets are planned as the training foundation:

| Dataset | Why we use it | Notes |
|---|---|---|
| [C-NMC 2019 (TCIA)](https://www.cancerimagingarchive.net/collection/c-nmc-2019/) | Core leukemia classification data (normal vs malignant lymphoblasts) | Used in the ISBI 2019 ALL challenge; primary dataset for ALL-focused baseline training |
| [ALL-IDB (ALL-IDB1 / ALL-IDB2)](https://scotti.di.unimi.it/all/) | Additional ALL-focused microscopy data for generalization and robustness | Includes whole-image and cropped-cell variants suitable for classification and ROI analysis |
| [Raabin-WBC](https://www.raabindata.com/free-data/) | Large WBC morphology diversity to improve feature robustness and pretraining | Useful for representation learning and domain adaptation before ALL-specific fine-tuning |

Planned dataset workflow:

1. Build a versioned dataset registry (source, split, license, preprocessing metadata).
2. Standardize stain/illumination normalization across sources.
3. Split by patient where possible to reduce leakage risk.
4. Use controlled augmentation and class-balancing for stable training.

Important: dataset licenses/usage terms will be reviewed per source before production use.

## Training Methods and Model Strategy

Planned training pipeline for leukemia detection:

1. **Preprocessing**
Normalize stain/contrast, quality-filter blurred slides, and standardize image resolution.
2. **Cell/ROI localization**
Use detection/segmentation to isolate diagnostically relevant regions before final classification.
3. **Leukemia classification**
Train deep CNN/ViT backbones with transfer learning on ALL-focused labels (normal vs suspicious/malignant).
4. **Hybrid inference (optional)**
Fuse deep visual embeddings with classic ML (e.g., gradient boosting) for calibrated decision boundaries.
5. **Explainability layer**
Generate SHAP/gradient-guided heatmaps to show why the model flagged a sample.
6. **Continuous learning loop**
Use clinician-reviewed corrections and newly labeled data to improve performance over time.

Evaluation plan:

- Prioritize **sensitivity/recall** for early suspicious-case flagging.
- Track precision, AUROC, F1, calibration error, and false-negative rate.
- Validate across dataset domains to measure generalization and drift resilience.

## How Python Trains the AI

Python is the training environment for LukaScope models, while the backend serves application APIs.

Training workflow in Python (`backend/ai`):

1. Load and validate datasets via `hooks/` modules.
2. Preprocess and standardize microscopy images via `functions/`.
3. Train leukemia detection/classification models with PyTorch/Ultralytics.
4. Evaluate recall-first performance and calibration metrics.
5. Export model artifacts for inference integration in the app stack.

Current AI folder layout:

- `backend/ai/hooks/`: dataset loading and source-specific hooks
- `backend/ai/functions/`: preprocessing and training functions
- `backend/ai/requirements.txt`: Python training dependencies

This keeps model training logic cleanly separated from the TypeScript backend API.

## Screenshots

The images below are visual assets used by the current demo UI and explainability flow.

| Preview | Description |
|---|---|
| <img src="./frontend/public/images/LumaScope%20Logo%204.png" alt="LukaScope branding logo" width="220" /> | **Branding logo** used in the login/dashboard navigation context. |
| <img src="./frontend/public/images/sample_1P.png" alt="Example blood smear sample result" width="220" /> | **Example blood smear sample** shown in results cards and detail views. |
| <img src="./frontend/public/images/shap_heatmap.png" alt="SHAP explainability heatmap" width="220" /> | **SHAP explainability heatmap** highlighting influential regions for model prediction. |
| <img src="./frontend/public/images/gradient_heatmap.png" alt="Gradient explainability heatmap" width="220" /> | **Gradient-based explainability map** showing model attention across the image. |
| <img src="./frontend/public/images/guided_backprop.png" alt="Guided backpropagation visualization" width="220" /> | **Guided backpropagation view** for feature-level interpretation support. |

## System Architecture

```mermaid
flowchart LR
  A["Clinician / User"] --> B["Next.js Frontend (App Router)"]
  B --> C["UI Workflows (Upload, Results, Explainability)"]
  B --> D["Backend API (Express)"]
  D --> E["Health + Middleware Layer"]
  D --> F["Domain APIs (planned)"]
  G["Python AI Training Pipeline"] --> H["Model Artifacts"]
  H --> D
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
- Clean API runtime structure in `backend/src` (`config.ts`, `hooks/`, `functions/`, `index.ts`)

### AI Training

- Python 3.11+
- PyTorch + TorchVision
- Ultralytics (YOLO family)
- scikit-learn
- OpenCV + Albumentations
- SHAP + Matplotlib
- Dedicated training workspace in `backend/ai` split into `hooks/` and `functions/`

## Setup and Installation

### Prerequisites

- Node.js 20+
- Bun 1.3+
- Python 3.11+ (for AI training scripts)

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd LukaScope
```

### 2) Install workspace dependencies

```bash
bun install
```

### Workspace Dependency Model (Bun)

- Install JavaScript/TypeScript dependencies from the repo root only (`bun install`).
- This monorepo is configured as a Bun workspace, so frontend/backend packages resolve from workspace-managed modules.
- Avoid running separate dependency installs inside `frontend` or `backend` unless intentionally isolating environments.

### 3) Configure backend environment

```bash
cp backend/.env.example backend/.env
```

### 4) (Optional) Set up Python AI environment

```bash
cd backend/ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
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

### Terminal C (Optional): Python AI training scaffold

```bash
cd backend/ai
source .venv/bin/activate
python functions/train_model.py
```

## Available Scripts

### Root workspace (`/`)

| Command | Description |
|---|---|
| `bun run dev:frontend` | Start frontend dev server |
| `bun run dev:backend` | Start backend dev server |
| `bun run build:frontend` | Build frontend |
| `bun run build:backend` | Build backend |
| `bun run lint:frontend` | Run frontend lint |

## Testing Strategy

Automated test coverage is planned as the next engineering phase. The approach is:

### Frontend testing

- Unit tests for UI components, utility functions, and page-level logic.
- Integration tests for key flows: login, dashboard interactions, analysis state transitions, and results rendering.
- End-to-end tests for critical user journeys in a browser environment.
- Accessibility and regression checks on core pages before release.

### Backend testing

- Unit tests for pure functions (`functions/`) and configuration parsing.
- Integration tests for API handlers, middleware behavior, and error contracts.
- Contract tests for response shape and status codes across planned domain routes.
- Smoke tests for `/health` and startup configuration validation in CI.

### Test execution model

1. Run fast unit tests on every commit/PR.
2. Run integration + end-to-end suites in CI before merge.
3. Block merges when lint/build/tests fail.
4. Track coverage trend and enforce minimum thresholds as the suite grows.

Current status: formal test scripts are not yet wired in `frontend/package.json` and `backend/package.json`; this section defines the implementation plan and quality gate model.

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
5. Add experiment tracking/versioning for Python training runs (metrics, datasets, checkpoints).

## Contributing

1. Create a feature branch.
2. Keep changes scoped by layer (`frontend` or `backend`).
3. Run lint/build before opening a PR.
4. Update this README when behavior or setup changes.

## License

MIT (see [`backend/package.json`](./backend/package.json)).
