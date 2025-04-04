# Event-Driven Microservice Architecture

A robust, scalable, and performant event-driven microservice architecture built with NestJS, featuring comprehensive monitoring, logging, and observability.

## Overview

The system consists of the following microservices:

- **Task Service**: Manages task-related operations
- **Balder Service**: Handles UI and task management interface
- **Heimdal Service**: Provides system-wide health monitoring
- **Webhook Service**: Handles webhook integrations and callbacks
- **AvettaDocAgent**: Handles Avetta document webhooks and management

## Core Features

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
- 📚 Swagger/OpenAPI documentation for all services

### Event System Features
- Event-driven communication using RabbitMQ
- Multiple caching strategies (LRU, LFU, FIFO, TTL)
- Database connection pooling with health monitoring
- Event batching and processing
- Event validation and compression
- Event archiving and retrieval
- Retry mechanisms and error handling

## Prerequisites

- Node.js >= 18
- Docker and Docker Compose
- PostgreSQL >= 16
- RabbitMQ

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
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
   docker-compose -f docker-compose.core.yml up -d
   ```

## Project Structure

```
.
├── services/
│   ├── task-service/    # Task management service
│   ├── balder/         # UI and task interface service
│   ├── heimdal/        # Health monitoring service
│   └── webhook-service/ # Webhook integration service
├── src/
│   ├── common/         # Shared modules and utilities
│   ├── config/         # Configuration files
│   ├── entities/       # Database entities
│   ├── interfaces/     # TypeScript interfaces
│   ├── modules/        # Feature modules
│   ├── repositories/   # Database repositories
│   └── services/       # Business logic services
├── test/              # Test files
├── docs/             # Documentation
└── docker/           # Docker configuration
```

## Documentation

Detailed documentation is available in the `docs` directory:

- [Swagger Documentation](docs/SWAGGER.md)
- [Event System Documentation](docs/EVENT_SYSTEM.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## API Access

Each service provides Swagger/OpenAPI documentation for its endpoints:

- Task Service: http://localhost:3000/api
- Balder Service: http://localhost:3002/api
- Heimdal Service: http://localhost:3003/api
- Webhook Service: http://localhost:3004/api

## Monitoring & Observability

The system includes comprehensive monitoring capabilities:

- Database connection health
- Cache performance metrics
- System resource utilization
- Event processing statistics

Access monitoring dashboards:
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090
- Kibana: http://localhost:5601

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
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
