# Backend NestJS Dockerfile
FROM node:18

# Install pnpm
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 5001

# Start the application
CMD ["pnpm", "start:prod"]