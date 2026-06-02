#!/usr/bin/env sh
set -eu

docker compose -f docker/docker-compose.dev.yml up -d --build

cat <<'EOF'

LukaScope development stack is running with hot reload:
Frontend: http://localhost:3000
Backend:  http://localhost:3001
Health:   http://localhost:3001/health

View logs:
docker compose -f docker/docker-compose.dev.yml logs -f frontend
docker compose -f docker/docker-compose.dev.yml logs -f python-backend

Stop with:
docker compose -f docker/docker-compose.dev.yml down
EOF
