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
USER nestjs

# Copy package files and prisma schema
COPY --chown=nestjs:nodejs package.json pnpm-lock.yaml ./
COPY --chown=nestjs:nodejs prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

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
USER nestjs

# Copy package files and prisma schema
COPY --chown=nestjs:nodejs package.json pnpm-lock.yaml ./
COPY --chown=nestjs:nodejs prisma ./prisma

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY --chown=nestjs:nodejs . .

# Build the application
RUN pnpm build && pnpm prisma:generate:prod

# Expose port
EXPOSE 5001

# Start the application
CMD ["dumb-init", "pnpm", "start:prod"]