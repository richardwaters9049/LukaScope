# Backend Dockerfile for LukaScope
FROM node:20-alpine AS base

# Install bun once in the base stage
RUN npm install -g bun@1.3.1

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN bun install

# Development stage
FROM base AS dev
WORKDIR /app

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

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 backend

# Copy only built artefacts and package files
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/

# Install production dependencies in backend directory
WORKDIR /app/backend
RUN bun install --production

USER backend

EXPOSE 3001

ENV PORT=3001
ENV NODE_ENV=production

# Start the backend server
CMD ["bun", "run", "start"]
