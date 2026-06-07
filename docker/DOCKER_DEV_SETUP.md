# Docker Development Setup

`docker/docker-compose.dev.yml` runs the local development stack with bind-mounted source files and reload-friendly services.

> All commands should be run from the repository root.

## Start

```bash
./scripts/docker-dev.sh
```

Service URLs:

- Frontend: `http://localhost:3000`
- Python backend: `http://localhost:3001`
- Health check: `http://localhost:3001/health`

## What Reloads

- `frontend/` is mounted into the frontend container and runs `bun run dev`.
- `backend/app/` is mounted into the FastAPI container and runs `uvicorn --reload`.
- `backend/app/` and `backend/ai/` are mounted into the worker container.
- Shared generated assets live in the `backend_assets` Docker volume.

## Useful Commands

```bash
docker compose -f docker/docker-compose.dev.yml logs -f frontend
docker compose -f docker/docker-compose.dev.yml logs -f python-backend
docker compose -f docker/docker-compose.dev.yml logs -f worker
docker compose -f docker/docker-compose.dev.yml restart python-backend worker
docker compose -f docker/docker-compose.dev.yml down
```

## Notes

- Browser code uses the Next.js `/backend-api` proxy. In Docker, set `BACKEND_API_URL=http://python-backend:3001` so the Next.js server can reach the backend service.
- Backend CORS should use `FRONTEND_URL=http://localhost:3000` for local Docker.
- Use `docker/docker-compose.yml` for production-like builds and `docker/docker-compose.test.yml` for isolated test containers.
