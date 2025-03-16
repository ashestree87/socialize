# Docker Setup Documentation

This document provides detailed information about the Docker configuration for the Socialize project.

## Overview

The Socialize project uses Docker to containerize all services, ensuring consistent environments across development, testing, and production. The setup includes:

- Backend (Laravel) container
- Frontend (React) container
- Web server (Nginx) container for the backend
- Database (MySQL) container
- Redis container for caching

## Prerequisites

- Docker Engine (version 20.10.0+)
- Docker Compose (version 2.0.0+)
- Git

## Configuration Files

### docker-compose.yml

The main configuration file that defines all services and their relationships.

### Dockerfiles

- `backend/Dockerfile`: Configuration for the Laravel backend
- `frontend/Dockerfile`: Configuration for the React frontend

### Nginx Configurations

- `docker/nginx/conf.d/app.conf`: Nginx configuration for the backend
- `frontend/nginx/nginx.conf`: Nginx configuration for the frontend

## Environment Variables

Environment variables are stored in `.env` files. A sample `.env.example` file is provided as a template.

Important environment variables include:

- Database credentials
- Redis configuration
- Cloudflare R2 credentials
- Application settings

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/socialize.git
   cd socialize
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your specific configuration.

4. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

5. Install Laravel dependencies:
   ```bash
   docker-compose exec backend composer install
   ```

6. Run Laravel migrations:
   ```bash
   docker-compose exec backend php artisan migrate
   ```

7. Install frontend dependencies:
   ```bash
   docker-compose exec frontend npm install
   ```

## Service Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:3306 (accessible via database client)
- Redis: localhost:6379 (accessible via Redis client)

## Common Commands

### Container Management

```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# View container logs
docker-compose logs -f [service_name]
```

### Backend Commands

```bash
# Run Laravel commands
docker-compose exec backend php artisan [command]

# Run Composer commands
docker-compose exec backend composer [command]
```

### Frontend Commands

```bash
# Run npm commands
docker-compose exec frontend npm [command]
```

## Data Persistence

Data is persisted using Docker volumes:

- `socialize-db-data`: MySQL database data
- `socialize-redis-data`: Redis data

## Network Configuration

All services are connected through the `socialize-network` bridge network, allowing them to communicate with each other using service names as hostnames.

## Production Considerations

For production deployment:

1. Update the `.env` file with production settings
2. Use proper secrets management
3. Consider using Docker Swarm or Kubernetes for orchestration
4. Set up proper monitoring and logging
5. Configure SSL certificates for secure communication 