#!/bin/bash

# Docker Build Script for Crypto Place Project
# Handles building and managing Docker images for frontend, backend, and database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if docker-compose.yml exists
check_compose_file() {
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found!"
        print_error "Please run this script from the project root directory."
        exit 1
    fi
}

# Build all services
build_all() {
    print_header "🔨 Building all Docker images..."
    check_compose_file
    
    print_status "Building frontend, backend, and database services..."
    docker compose build --no-cache
    
    print_status "All images built successfully!"
    docker images | grep crypto-place
}

# Build specific service
build_service() {
    local service=$1
    if [ -z "$service" ]; then
        print_error "Please specify a service: frontend, backend, or postgres"
        exit 1
    fi
    
    print_header "🔨 Building $service image..."
    check_compose_file
    
    case "$service" in
        "frontend"|"backend"|"postgres")
            docker compose build --no-cache "$service"
            print_status "$service image built successfully!"
            ;;
        *)
            print_error "Invalid service: $service"
            print_error "Available services: frontend, backend, postgres"
            exit 1
            ;;
    esac
}

# Start services with build
start_with_build() {
    print_header "🚀 Building and starting all services..."
    check_compose_file
    
    print_status "Building images..."
    docker compose build
    
    print_status "Starting services..."
    docker compose up -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    show_status
}

# Show service status
show_status() {
    print_header "📊 Service Status:"
    docker compose ps
    
    echo ""
    print_header "🌐 Service URLs:"
    echo "  Frontend:  http://localhost:3001"
    echo "  Backend:   http://localhost:5001"
    echo "  Database:  localhost:5433"
    echo "  API Docs:  http://localhost:5001/api/docs"
}

# Push images to registry (if configured)
push_images() {
    if [ -z "$DOCKER_USERNAME" ]; then
        print_warning "DOCKER_USERNAME not set. Cannot push images."
        print_warning "Set DOCKER_USERNAME environment variable to push to Docker Hub."
        return 1
    fi
    
    print_header "📤 Pushing images to Docker Hub..."
    
    # Tag and push frontend
    print_status "Tagging frontend image..."
    docker tag crypto-place-frontend "$DOCKER_USERNAME/crypto-place-frontend:latest"
    docker push "$DOCKER_USERNAME/crypto-place-frontend:latest"
    
    # Tag and push backend
    print_status "Tagging backend image..."
    docker tag crypto-place-backend "$DOCKER_USERNAME/crypto-place-backend:latest"
    docker push "$DOCKER_USERNAME/crypto-place-backend:latest"
    
    print_status "Images pushed successfully!"
}

# Development mode with hot reload
dev_mode() {
    print_header "🔧 Starting development mode with live reload..."
    check_compose_file
    
    print_status "Building development images..."
    docker compose -f docker-compose.yml build
    
    print_status "Starting development services with volume mounts..."
    docker compose -f docker-compose.yml up -d
    
    print_status "Development environment ready!"
    print_status "Frontend and backend code changes will be reflected automatically."
    show_status
}

# Production build
prod_build() {
    print_header "🏭 Building production images..."
    
    # Build frontend production image
    if [ -f "frontend/Dockerfile.prod" ]; then
        print_status "Building frontend production image..."
        docker build -t crypto-place-frontend:prod -f frontend/Dockerfile.prod frontend/
    fi
    
    # Build backend production image
    print_status "Building backend production image..."
    docker build -t crypto-place-backend:prod backend/
    
    print_status "Production images built successfully!"
    docker images | grep crypto-place
}

# Clean up images
cleanup() {
    print_header "🧹 Cleaning up Docker images..."
    
    print_status "Removing stopped containers..."
    docker container prune -f
    
    print_status "Removing unused images..."
    docker image prune -f
    
    print_status "Removing dangling images..."
    docker image prune -a -f
    
    print_status "Cleanup completed!"
}

# Show help
show_help() {
    print_header "🐳 Docker Build Script for Crypto Place"
    echo ""
    echo "Usage: $0 [COMMAND] [SERVICE]"
    echo ""
    echo "Commands:"
    echo "  build [service]   Build all images or specific service (frontend|backend|postgres)"
    echo "  start             Build and start all services"
    echo "  dev               Start development mode with live reload"
    echo "  prod              Build production-optimized images"
    echo "  push              Push images to Docker Hub (requires DOCKER_USERNAME)"
    echo "  status            Show current service status"
    echo "  cleanup           Clean up unused Docker images"
    echo "  help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build              # Build all images"
    echo "  $0 build frontend     # Build only frontend image"
    echo "  $0 start              # Build and start all services"
    echo "  $0 dev                # Start development mode"
    echo "  $0 prod               # Build production images"
    echo ""
    echo "Environment Variables:"
    echo "  DOCKER_USERNAME       Your Docker Hub username (for pushing images)"
    echo ""
    echo "Architecture:"
    echo "  📦 Frontend: React + Vite (Port 3001)"
    echo "  🔧 Backend:  NestJS + Prisma (Port 5001)" 
    echo "  🗄️  Database: PostgreSQL 15 (Port 5433)"
}

# Main script logic
case "${1:-help}" in
    build)
        if [ -n "$2" ]; then
            build_service "$2"
        else
            build_all
        fi
        ;;
    start)
        start_with_build
        ;;
    dev)
        dev_mode
        ;;
    prod)
        prod_build
        ;;
    push)
        push_images
        ;;
    status)
        show_status
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac