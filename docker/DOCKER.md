# Docker Setup for LukaScope

This guide covers the containerized LukaScope stack: Next.js frontend, Python FastAPI backend, Redis worker, Postgres metadata store, and Redis queue.

> All commands should be run from the repository root.

## Quick Start

Only Docker is required on the host machine for this path.

```bash
./scripts/docker-up.sh
```

Service URLs:

- Frontend: `http://localhost:3000`
- Python backend: `http://localhost:3001`
- Health check: `http://localhost:3001/health`

## Architecture

```text
Next.js frontend -> FastAPI backend -> Postgres
                         |
                         v
                    Redis queue -> Python worker
                         |
                         v
              filesystem assets/models/heatmaps
```

The frontend sends uploads to FastAPI. The backend stores the original image, creates an analysis job, and queues inference work. The worker runs preprocessing/inference, writes result metadata to Postgres, and stores generated heatmaps on the shared backend asset volume.

## Services

- `frontend`: Next.js 16 app served with Bun.
- `python-backend`: FastAPI app on port `3001`.
- `worker`: Python RQ worker for inference and retraining jobs.
- `postgres`: metadata, job state, results, reviews, and training runs.
- `redis`: async job queue.

## Production-Like Compose

```bash
./scripts/docker-up.sh
docker compose -f docker/docker-compose.yml logs -f python-backend
docker compose -f docker/docker-compose.yml down
```

Rebuild one service:

```bash
docker compose -f docker/docker-compose.yml up -d --build frontend
docker compose -f docker/docker-compose.yml up -d --build python-backend worker
```

## Development Compose

```bash
./scripts/docker-dev.sh
docker compose -f docker/docker-compose.dev.yml logs -f frontend
docker compose -f docker/docker-compose.dev.yml logs -f python-backend worker
```

The development file bind-mounts `frontend/`, `backend/app/`, and `backend/ai/` so frontend and Python backend changes reload without rebuilding images.

## Testing

```bash
docker compose -f docker/docker-compose.test.yml up --build
docker compose -f docker/docker-compose.test.yml up --build frontend-test
docker compose -f docker/docker-compose.test.yml up --build backend-test
```

Docker test stages run Jest/React Testing Library for the frontend and pytest for the Python backend.

## Environment

Frontend:

```yaml
BACKEND_API_URL: http://python-backend:3001
```

Backend and worker:

```yaml
DATABASE_URL: postgresql+psycopg2://lukascope:lukascope@postgres:5432/lukascope
REDIS_URL: redis://redis:6379/0
STORAGE_ROOT: /app/data/storage
FRONTEND_URL: http://localhost:3000
```

Use `BACKEND_API_URL` for the backend origin the Next.js server can reach when deploying outside local Docker.
