# Backend Dockerfile for LukaScope
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies from the workspace root
# Note: This assumes the Docker build context is the workspace root
COPY package.json bun.lock* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install bun and dependencies
RUN npm install -g bun@1.3.1
RUN bun install

# Development stage
FROM base AS dev
WORKDIR /app

# Install bun globally
RUN npm install -g bun@1.3.1

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy package files for potential reinstall
COPY package.json bun.lock* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Set development environment
ENV NODE_ENV=development

EXPOSE 3001

# Set working directory for development
WORKDIR /app/backend

# Start development server with hot reload
CMD ["bun", "run", "dev"]

# Builder stage
FROM base AS builder
WORKDIR /app

# Install bun globally
RUN npm install -g bun@1.3.1

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy source files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Build backend TypeScript
RUN bun run build:backend

# Test stage
FROM base AS test
WORKDIR /app

# Install bun globally
RUN npm install -g bun@1.3.1

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy source files
COPY . .

# Set environment variables
ENV NODE_ENV=test

# Run tests
RUN bun run --cwd backend test:coverage

# Production stage
FROM base AS runner
WORKDIR /app

# Install bun globally
RUN npm install -g bun@1.3.1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy built files and package files
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/src ./backend/src
COPY --from=builder /app/backend/.env.example ./backend/.env

# Install production dependencies in backend directory
WORKDIR /app/backend
RUN bun install --production

USER backend

EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

# Start the backend server
CMD ["bun", "run", "start"]
