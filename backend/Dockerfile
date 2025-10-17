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

# Install dependencies as root
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application and generate Prisma client as root (needs write access)
RUN pnpm build && pnpm prisma:generate:prod

# Change ownership to nestjs user AFTER everything is set up
RUN chown -R nestjs:nodejs /app

# Switch to nestjs user for runtime
USER nestjs

# Expose port
EXPOSE 5001

# Start the application in development mode (skip prisma generate since it's already done in build)
CMD ["dumb-init", "pnpm", "exec", "nest", "start", "--watch"]

# Production stage
FROM base AS production
WORKDIR /app

# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install all dependencies (including devDependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application and generate Prisma client
RUN pnpm build && pnpm prisma:generate:prod

# Remove dev dependencies and reinstall only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Change ownership to nestjs user
RUN chown -R nestjs:nodejs /app

# Switch to nestjs user for runtime
USER nestjs

# Expose port
EXPOSE 5001

# Start the application
CMD ["dumb-init", "pnpm", "start:prod"]