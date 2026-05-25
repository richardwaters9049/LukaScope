# Docker Development Setup with Hot Reload

This document explains the Docker development configuration that enables hot reload for both frontend and backend services.

## Problem Solved

The original Docker setup (`docker-compose.yml`) was configured for production only:
- No volume mounts for code syncing
- Services ran in production mode (`NODE_ENV=production`)
- Changes made on the host filesystem were not reflected in containers
- Changes made inside containers were lost when containers were destroyed

## Solution

Created `docker-compose.dev.yml` with development-specific configuration:
- Volume mounts sync local code changes to containers
- Services run in development mode (`NODE_ENV=development`)
- Frontend uses Next.js dev server with hot reload
- Backend uses ts-node-dev with auto-restart
- Changes on host filesystem are reflected immediately

## Usage

### Start Development Environment

```bash
# Start services with hot reload
docker-compose -f docker-compose.dev.yml up -d --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f backend

# Stop development services
docker-compose -f docker-compose.dev.yml down
```

### Service URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

### Development Workflow

1. Make code changes on your host filesystem
2. Changes are automatically synced to containers via volume mounts
3. Frontend Next.js dev server automatically reloads
4. Backend ts-node-dev automatically restarts on TypeScript changes
5. No need to rebuild containers when making code changes
6. Changes persist when containers are restarted (they're on your host filesystem)

## Configuration Files

### docker-compose.dev.yml

Development-specific Docker Compose configuration with:
- Frontend service using `dev` target from Dockerfile
- Backend service using `dev` target from Dockerfile
- Volume mounts for source code
- Development environment variables
- Development commands (`bun run dev`)

### Dockerfile Changes

**frontend/Dockerfile**:
- Added `dev` stage for development
- Runs Next.js dev server with hot reload
- Sets `NODE_ENV=development`

**backend/Dockerfile**:
- Added `dev` stage for development
- Runs ts-node-dev with auto-restart
- Sets `NODE_ENV=development`

### Volume Mount Details

**Frontend**:
- `./frontend:/app` - Mount entire frontend directory
- `/app/node_modules` - Prevent overwriting container node_modules
- `/app/.next` - Prevent overwriting build artifacts

**Backend**:
- `./backend/src:/app/backend/src` - Mount source code
- `./backend/package.json:/app/backend/package.json` - Mount package.json
- `./backend/tsconfig.json:/app/backend/tsconfig.json` - Mount TypeScript config
- `/app/backend/node_modules` - Prevent overwriting container node_modules
- `/app/backend/dist` - Prevent overwriting build artifacts

## Important Notes

### Use Correct Configuration

- **Development**: Use `docker-compose.dev.yml` for development with hot reload
- **Production**: Use `docker-compose.yml` for production builds
- **Testing**: Use `docker-compose.test.yml` for running tests

### Button Persistence Issue

The issue where buttons disappeared after `docker-compose down` was caused by:
1. Making changes inside containers instead of on host filesystem
2. No volume mounts to sync changes back to host
3. Container destruction removing all changes made inside

With the new development setup:
- Make changes on your host filesystem using your preferred editor
- Changes are synced to containers automatically
- Changes persist when containers are restarted
- No risk of losing work

### TypeScript Configuration

The backend `tsconfig.json` was updated to be compatible with ts-node-dev by:
- Using `"module": "commonjs"` 
- Removing explicit `"moduleResolution"` to use defaults
- This ensures compatibility with ts-node-dev's TypeScript compilation

## Troubleshooting

### Hot Reload Not Working

1. Verify you're using `docker-compose.dev.yml`, not `docker-compose.yml`
2. Check volume mounts are working: `docker exec lukascope-frontend-1 ls /app`
3. Restart services: `docker-compose -f docker-compose.dev.yml restart`
4. Rebuild if needed: `docker-compose -f docker-compose.dev.yml up -d --build`

### TypeScript Compilation Errors

1. Ensure `tsconfig.json` is mounted in backend volume
2. Check TypeScript configuration is compatible with ts-node-dev
3. Restart backend service: `docker-compose -f docker-compose.dev.yml restart backend`

### Changes Not Reflecting

1. Make sure you're editing files on host filesystem, not inside containers
2. Check volume mounts are correct in `docker-compose.dev.yml`
3. Verify file permissions on host filesystem
4. Restart the affected service

## Benefits

1. **Instant Feedback**: Code changes are reflected immediately
2. **No Data Loss**: Changes persist on host filesystem
3. **Consistent Environment**: Same containers as production, but with development features
4. **Faster Development**: No need to rebuild containers for code changes
5. **Better Workflow**: Use your preferred editor on host filesystem

## Migration from Production Setup

If you were previously using the production setup for development:

1. Stop production containers: `docker-compose down`
2. Start development containers: `docker-compose -f docker-compose.dev.yml up -d --build`
3. Edit files on your host filesystem (not inside containers)
4. Enjoy hot reload and persistent changes

The production setup remains available for deployment testing.