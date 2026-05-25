# Docker Setup for LukaScope

This guide covers Docker containerization for the LukaScope project, including frontend, backend, and AI training services.

> **Note**: All commands below should be run from the **repository root** directory.

## Quick Start

```bash
# Build and start all services
docker-compose -f docker/docker-compose.yml up -d --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│   Backend       │
│   (Next.js)     │         │   (Express)     │
│   Port: 3000    │         │   Port: 3001    │
└─────────────────┘         └─────────────────┘
                                      │
                                      ▼
                              ┌─────────────────┐
                              │   AI Training   │
                              │   (Python)      │
                              │   (Optional)    │
                              └─────────────────┘
```

## Services

### Frontend
- **Technology**: Next.js 16 with Bun runtime
- **Base Image**: oven/bun:1.3.1-alpine
- **Port**: 3000
- **Features**: Multi-stage build, standalone output, non-root user

### Backend
- **Technology**: Express.js with Node.js
- **Base Image**: node:20-alpine
- **Port**: 3001
- **Features**: TypeScript compilation, Bun workspace support

### AI Training (Optional)
- **Technology**: Python 3.11 with PyTorch
- **Base Image**: python:3.11-slim
- **Profile**: ai (on-demand execution)
- **Features**: ML dependencies, image processing libraries

## Testing

### Docker-Based Testing

The project includes a comprehensive Docker testing setup that runs tests in isolated containers:

```bash
# Run all tests
docker-compose -f docker/docker-compose.test.yml up --build

# Run frontend tests only
docker-compose -f docker/docker-compose.test.yml up frontend-test

# Run backend tests only
docker-compose -f docker/docker-compose.test.yml up backend-test

# Run AI tests (with profile)
docker-compose -f docker/docker-compose.test.yml --profile ai up ai-test
```

### Test Stages in Dockerfiles

Each Dockerfile includes a dedicated `test` stage:

- **Frontend**: Runs Jest tests with coverage using React Testing Library
- **Backend**: Runs Jest tests with coverage for TypeScript code
- **AI**: Runs pytest tests with coverage for Python ML code

### Local Testing (Without Docker)

You can also run tests locally without Docker:

**Frontend Tests**:
```bash
cd frontend
bun install
bun run test              # Run tests
bun run test:watch        # Watch mode
bun run test:coverage     # With coverage report
```

**Backend Tests**:
```bash
cd backend
bun install
bun run test              # Run tests
bun run test:watch        # Watch mode
bun run test:coverage     # With coverage report
```

**AI Tests**:
```bash
cd backend/ai
pip install -r requirements.txt
pytest                    # Run tests
pytest -v                # Verbose output
pytest --cov             # With coverage
```

### Test Frameworks

- **Frontend**: Jest + React Testing Library
- **Backend**: Jest + ts-jest
- **AI**: pytest + pytest-cov

### Test Coverage Reports

Coverage reports are generated in:
- Frontend: `frontend/coverage/`
- Backend: `backend/coverage/`
- AI: `backend/ai/htmlcov/`

### CI/CD Integration

For CI/CD pipelines, use the test Dockerfiles:

```yaml
# Example CI/CD workflow
- name: Run Tests
  run: |
    docker-compose -f docker/docker-compose.test.yml up --build
    docker-compose -f docker/docker-compose.test.yml down
```

## Usage

### Basic Commands

```bash
# Start all services
docker-compose -f docker/docker-compose.yml up -d

# Stop all services
docker-compose -f docker/docker-compose.yml down

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Rebuild specific service
docker-compose -f docker/docker-compose.yml up -d --build frontend
docker-compose -f docker/docker-compose.yml up -d --build backend

# Check service status
docker-compose -f docker/docker-compose.yml ps
```

### Development Workflow

```bash
# Start in development mode
docker-compose -f docker/docker-compose.yml up -d --build

# Enter container for debugging
docker-compose -f docker/docker-compose.yml exec frontend sh
docker-compose -f docker/docker-compose.yml exec backend sh

# Run commands inside container
docker-compose -f docker/docker-compose.yml exec frontend bun run dev
docker-compose -f docker/docker-compose.yml exec backend bun run dev
```

### AI Training

```bash
# Run AI training service
docker-compose -f docker/docker-compose.yml --profile ai up ai-training

# Run specific AI command
docker-compose -f docker/docker-compose.yml --profile ai run ai-training python functions/train_model.py

# Run model evaluation
docker-compose -f docker/docker-compose.yml --profile ai run ai-training python functions/evaluate_model.py
```

## Environment Configuration

### Frontend Environment
Set in `docker/docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_API_URL=http://backend:3001
```

### Backend Environment
Set in `docker/docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - FRONTEND_URL=http://frontend:3000
```

For custom configuration, create a `.env` file:
```bash
# .env
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
PORT=3001
```

## Docker Files

- `docker/docker-compose.yml` - Main orchestration file
- `frontend/Dockerfile` - Frontend container build
- `backend/Dockerfile` - Backend container build
- `backend/ai/Dockerfile` - AI training container build
- `.dockerignore` files - Build context optimization

## Build Optimization

The Docker setup uses several optimization strategies:

1. **Multi-stage builds** - Separate build and runtime environments
2. **Layer caching** - Dependencies cached separately from source code
3. **.dockerignore** - Exclude unnecessary files from build context
4. **Alpine images** - Smaller base images for faster builds
5. **Standalone output** - Optimized Next.js production builds

## Troubleshooting

### Build Failures

```bash
# Clean rebuild
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml build --no-cache
docker-compose -f docker/docker-compose.yml up -d
```

### Port Conflicts

If ports 3000 or 3001 are already in use:
```yaml
# Edit docker/docker-compose.yml
services:
  frontend:
    ports:
      - "3001:3000"  # Change host port
  backend:
    ports:
      - "3002:3001"  # Change host port
```

### Permission Issues

```bash
# Fix file permissions
docker-compose -f docker/docker-compose.yml down
sudo chown -R $USER:$USER .
docker-compose -f docker/docker-compose.yml up -d
```

### Container Access

```bash
# Check container logs
docker-compose -f docker/docker-compose.yml logs frontend
docker-compose -f docker/docker-compose.yml logs backend

# Enter container shell
docker-compose -f docker/docker-compose.yml exec frontend sh
docker-compose -f docker/docker-compose.yml exec backend sh

# Inspect container
docker inspect lukascope-frontend-1
docker inspect lukascope-backend-1
```

### Resource Issues

```bash
# Check Docker resource usage
docker stats

# Increase Docker resources in Docker Desktop settings
# Settings → Resources → Memory/CPUs
```

## Production Deployment

### Security Considerations

1. **Non-root users**: All containers run as non-root users
2. **Minimal base images**: Using Alpine Linux for smaller attack surface
3. **Environment variables**: Sensitive data via environment variables
4. **Network isolation**: Services on internal Docker network

### Scaling

```bash
# Scale frontend (requires load balancer)
docker-compose -f docker/docker-compose.yml up -d --scale frontend=3

# Scale backend
docker-compose -f docker/docker-compose.yml up -d --scale backend=2
```

### Health Checks

Add health checks to `docker/docker-compose.yml`:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Maintenance

### Cleanup

```bash
# Stop and remove containers
docker-compose -f docker/docker-compose.yml down

# Remove volumes (WARNING: deletes data)
docker-compose -f docker/docker-compose.yml down -v

# Clean unused Docker resources
docker system prune -a
```

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml build --no-cache
docker-compose -f docker/docker-compose.yml up -d
```

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- Project AGENTS.md: `AGENTS.md`
