#!/usr/bin/env sh
set -eu

docker compose -f docker/docker-compose.yml up -d --build

cat <<'EOF'

LukaScope is running:
Frontend: http://localhost:3000
Backend:  http://localhost:3001
Health:   http://localhost:3001/health

Stop with:
docker compose -f docker/docker-compose.yml down
EOF
