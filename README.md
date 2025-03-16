# Socialize

A modern social media platform built with Laravel/Node.js backend, React frontend, and Cloudflare integration.

## Project Overview

Socialize is a full-stack social media application that allows users to connect, share content, and interact in real-time. The application is containerized with Docker and uses Cloudflare for DNS, security, and content delivery.

## Tech Stack

- **Backend**: Laravel/Node.js
- **Frontend**: React with TypeScript
- **Database**: MySQL/PostgreSQL
- **Caching**: Redis
- **Content Storage**: Cloudflare R2
- **Infrastructure**: Docker, Cloudflare

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v16+)
- Cloudflare account (for production deployment)
- Git

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/socialize.git
   cd socialize
   ```

2. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:3306 (MySQL) or localhost:5432 (PostgreSQL)
   - Redis: localhost:6379

## Environment Configuration

The project uses Docker to ensure consistent environments across development, testing, and production. Environment-specific variables are stored in `.env` files which are not committed to the repository.

See `.env.example` for required environment variables.

## Documentation

- [Coding Standards](.cursorrules) - Project coding conventions and guidelines
- [Docker Setup](docs/docker-setup.md) - Detailed Docker configuration
- [Cloudflare Integration](docs/cloudflare-integration.md) - Cloudflare and R2 setup
- [API Documentation](docs/api-docs.md) - Backend API endpoints and usage

## Deployment

Deployment is managed through CI/CD pipelines. See the [Deployment Guide](docs/deployment.md) for detailed instructions.

## Contributing

Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 