# Frontend Dockerfile
FROM node:18-alpine AS base

# Install pnpm and add non-root user
RUN corepack enable pnpm && \
    apk add --no-cache wget && \
    addgroup -g 1001 -S nodejs && \
    adduser -S react -u 1001

# Development stage
FROM base AS development
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies as root user (needed for pnpm cache access)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Change ownership of everything to react user AFTER setup
RUN chown -R react:nodejs /app

# Switch to react user for runtime
USER react

# Set default environment variables (can be overridden by docker-compose or .env files)
ARG VITE_API_BASE_URL=http://localhost:5001
ARG VITE_FE_PORT=5173
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_FE_PORT=${VITE_FE_PORT}

# Expose port
EXPOSE 5173

# Start the application in development mode
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]