# Backend NestJS Dockerfile
FROM node:18-alpine AS base

# Install pnpm and common dependencies
RUN corepack enable pnpm && \
    apk add --no-cache dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Development stage
FROM base AS development
WORKDIR /app

# Copy package files and prisma schema with proper ownership
COPY --chown=nestjs:nodejs package.json pnpm-lock.yaml ./
COPY --chown=nestjs:nodejs prisma ./prisma

# Install dependencies as root, then change ownership
RUN pnpm install --frozen-lockfile && \
    chown -R nestjs:nodejs /app

# Switch to nestjs user for subsequent operations
USER nestjs

# Copy source code
COPY --chown=nestjs:nodejs . .

# Generate Prisma client
RUN pnpm prisma:generate:prod

# Expose port
EXPOSE 5001

# Start the application in development mode
CMD ["dumb-init", "pnpm", "start:dev"]

# Production stage
FROM base AS production
WORKDIR /app

# Copy package files and prisma schema with proper ownership
COPY --chown=nestjs:nodejs package.json pnpm-lock.yaml ./
COPY --chown=nestjs:nodejs prisma ./prisma

# Install all dependencies for building (including devDependencies)
RUN pnpm install --frozen-lockfile && \
    chown -R nestjs:nodejs /app

# Switch to nestjs user for subsequent operations
USER nestjs

# Copy source code
COPY --chown=nestjs:nodejs . .

# Build the application
RUN pnpm build && pnpm prisma:generate:prod

# Switch back to root to clean up dev dependencies
USER root

# Remove dev dependencies and reinstall only production dependencies
RUN pnpm install --frozen-lockfile --prod && \
    chown -R nestjs:nodejs /app

# Switch back to nestjs user for runtime
USER nestjs

# Expose port
EXPOSE 5001

# Start the application
CMD ["dumb-init", "pnpm", "start:prod"]