# Frontend Dockerfile
FROM node:18-alpine

# Install pnpm
RUN corepack enable pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV VITE_API_BASE_URL=http://localhost:5001
ENV VITE_FE_PORT=5173

# Expose port
EXPOSE 5173

# Start the application in development mode
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5173"]