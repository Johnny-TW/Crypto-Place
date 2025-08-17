# Frontend Dockerfile
FROM node:18-alpine AS base

# Install pnpm and add non-root user
RUN corepack enable pnpm && \
    addgroup -g 1001 -S nodejs && \
    adduser -S react -u 1001

# Development stage
FROM base AS development
WORKDIR /app
USER react

# Copy package files
COPY --chown=react:nodejs package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --chown=react:nodejs . .

# Set environment variables
ENV VITE_API_BASE_URL=http://localhost:5001
ENV VITE_FE_PORT=5173

# Expose port
EXPOSE 5173

# Start the application in development mode
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]