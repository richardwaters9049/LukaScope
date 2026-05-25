# Docker Development Guide

## Hot Reload Setup

The project uses Docker Compose with hot reload enabled for development. Changes made locally are immediately reflected in the running containers.

### Development Commands

**Start development environment with hot reload:**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

**View logs:**
```bash
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f backend
```

**Stop development environment:**
```bash
docker-compose -f docker-compose.dev.yml down
```

### Important Notes

1. **Always use `-f docker-compose.dev.yml` for development**
   - The regular `docker-compose.yml` is for production only
   - Production builds don't include volume mounts, so your changes won't be visible
   - If you run `docker compose down` without the dev file, you're stopping production containers

2. **Hot reload works for:**
   - Frontend: All files in `frontend/` directory
   - Backend: All files in `backend/` directory

3. **Volume mounts are configured to:**
   - Mount your local code into the container
   - Preserve container `node_modules` (prevents conflicts)
   - Preserve build artifacts (`.next`, `dist`)

### Troubleshooting

**Changes not appearing:**
1. Check you're using the dev compose file: `docker-compose -f docker-compose.dev.yml`
2. Verify containers are running: `docker-compose -f docker-compose.dev.yml ps`
3. Check logs for errors: `docker-compose -f docker-compose.dev.yml logs -f`

**Permission issues:**
If you encounter permission errors, ensure the containers have proper access to mounted volumes. The dev configuration uses the same user as the base image.

**Clean restart:**
If hot reload stops working:
```bash
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### Production Deployment

For production deployment, use the standard docker-compose.yml:
```bash
docker-compose up -d --build
```

Note: Production builds require rebuilding containers to see changes.
