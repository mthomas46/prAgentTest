# Event-Driven Microservice Architecture

A robust, scalable, and performant event-driven microservice architecture built with NestJS.

## Features

- Event-driven communication using RabbitMQ
- Multiple caching strategies (LRU, LFU, FIFO, TTL)
- Database connection pooling with health monitoring
- Comprehensive performance monitoring
- Event batching and processing
- Event validation and compression
- Event archiving and retrieval
- Retry mechanisms and error handling

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v12 or later)
- RabbitMQ
- Docker (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-driven-microservice.git
cd event-driven-microservice
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the services:
```bash
# Using Docker Compose
docker-compose up -d

# Or manually
npm run start:dev
```

## Project Structure

```
├── src/
│   ├── common/           # Shared modules and utilities
│   ├── config/          # Configuration files
│   ├── entities/        # Database entities
│   ├── interfaces/      # TypeScript interfaces
│   ├── modules/         # Feature modules
│   ├── repositories/    # Database repositories
│   └── services/        # Business logic services
├── test/               # Test files
├── docs/              # Documentation
└── docker/            # Docker configuration
```

## Documentation

Detailed documentation is available in the `docs` directory:

- [Event System Documentation](docs/EVENT_SYSTEM.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Testing

Run the test suite:
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Monitoring

The system includes comprehensive monitoring capabilities:

- Database connection health
- Cache performance metrics
- System resource utilization
- Event processing statistics

Access monitoring dashboards:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

# Microservices Architecture

A modern, scalable microservices architecture built with NestJS, featuring comprehensive monitoring, logging, and observability.

## Architecture Overview

The system consists of the following microservices:

- **API Gateway**: Main entry point that handles routing and authentication
- **Task Service**: Manages task-related operations
- **Webhook Service**: Handles webhook integrations and callbacks
- **Document Service**: Manages document processing and storage
- **Monitoring Service**: Handles system health and metrics

## Features

- 🔐 Secure authentication and authorization
- 📊 Comprehensive monitoring with Prometheus and Grafana
- 📝 Centralized logging with ELK Stack
- 🔍 Distributed tracing with OpenTelemetry
- 🚦 Circuit breakers and fallbacks
- 📈 Auto-scaling capabilities
- 🔄 Message queuing with RabbitMQ
- 🗄️ Data persistence with PostgreSQL
- 🎯 Health checks and monitoring
- 🛡️ Rate limiting and security middleware

## Prerequisites

- Node.js >= 18
- Docker and Docker Compose
- PostgreSQL 16
- RabbitMQ
- Elasticsearch 8.x
- Redis (optional)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the services:
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run start:prod
   ```

5. Start monitoring stack:
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

## Project Structure

```
.
├── services/
│   ├── api-gateway/
│   ├── task-service/
│   ├── webhook-service/
│   ├── document-service/
│   └── monitoring-service/
├── shared/
│   ├── config/
│   ├── middleware/
│   ├── interceptors/
│   ├── filters/
│   ├── guards/
│   ├── pipes/
│   └── types/
├── docker/
│   ├── development/
│   └── production/
└── docs/
    ├── api/
    ├── architecture/
    └── deployment/
```

## API Documentation

API documentation is available at:
- Swagger UI: `http://localhost:3002/api`
- ReDoc: `http://localhost:3002/api-docs`

## Monitoring & Observability

- Grafana: `http://localhost:3001`
- Prometheus: `http://localhost:9090`
- Kibana: `http://localhost:5601`

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# AvettaDocAgent

A NestJS-based service for handling Avetta document webhooks and management.

## Description

This service provides endpoints for:
- Webhook processing for Avetta document events
- Document management (create, update, delete)
- Health checks and metrics
- REST API for document operations

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker

```bash
# Build and start containers
$ docker-compose up -d --build

# Stop containers
$ docker-compose down
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics endpoint
- `POST /webhook` - Webhook endpoint for document events
- `GET /documents` - List all documents
- `GET /documents/:id` - Get a specific document

## Environment Variables

- `PORT` - Server port (default: 3002)
- `WEBHOOK_SECRET` - Secret key for webhook signature verification

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

UNLICENSED

# Task Management API

## Database Management

### Database Viewer (Adminer)

The project includes a Dockerized Adminer instance for database management. To access it:

1. Start the database viewer:
```bash
docker-compose up adminer
```

2. Access Adminer at http://localhost:8080

3. Login details:
   - System: SQLite3
   - Database: /data/tasks.db
   - Username: (leave empty)
   - Password: (leave empty)

Features:
- Real-time database inspection
- SQL query execution
- Table structure viewing
- Data browsing and editing
- Export/Import functionality

Note: The database file is mounted from the `./data` directory. Make sure this directory exists and has proper permissions.
