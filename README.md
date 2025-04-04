# Event-Driven Microservice Architecture

A robust, scalable, and performant event-driven microservice architecture built with Node.js and TypeScript, featuring comprehensive monitoring, logging, and observability.

## Overview

The system consists of the following microservices:

- **Task Service** (Port 3000): Core task management service
- **Draupnir External** (Port 3003): External load balancer for Heimdal and Bifrost services
- **Draupnir Internal** (Port 3004): Internal load balancer for core microservices
- **PostgreSQL** (Port 5432/5433): Database service
- **Loki** (Port 3100): Log aggregation service

## Core Features

- 🔄 Load balancing with Draupnir services
- 🗄️ Data persistence with PostgreSQL
- 📝 Centralized logging with Loki
- 🎯 Health checks and monitoring
- 🛡️ Rate limiting and security middleware
- 🔐 Secure service-to-service communication

## Prerequisites

- Node.js >= 18
- Docker and Docker Compose
- PostgreSQL >= 16

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd event-driven-microservice
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the services:
   ```bash
   docker-compose up -d
   ```

4. Verify services are running:
   ```bash
   # Check service health endpoints
   curl http://localhost:3000/health  # Task Service
   curl http://localhost:3003/health  # Draupnir External
   curl http://localhost:3004/health  # Draupnir Internal
   ```

## Service Configuration

### Task Service
- Port: 3000
- Database: PostgreSQL
- Environment variables:
  - `DB_HOST`: postgres
  - `DB_PORT`: 5432
  - `DB_USERNAME`: postgres
  - `DB_PASSWORD`: postgres
  - `DB_NAME`: task_service

### Draupnir External
- Port: 3003
- Load balances:
  - Bifrost service
  - Heimdal service
- Configuration in `services/draupnir_external/src/config.ts`

### Draupnir Internal
- Port: 3004
- Load balances:
  - Task service
  - Core services
- Configuration in `services/draupnir_internal/src/config.ts`

### PostgreSQL
- Internal Port: 5432
- Host Port: 5433
- Default credentials:
  - Username: postgres
  - Password: postgres
  - Database: task_service

### Loki
- Port: 3100
- Log aggregation for all services
- Configuration via `docker-compose.yml`

## Project Structure

```
.
├── services/
│   ├── draupnir_external/  # External load balancer
│   ├── draupnir_internal/  # Internal load balancer
│   └── task-service/       # Task management service
├── src/
│   ├── config/            # Configuration files
│   ├── models/            # Database models
│   └── services/          # Business logic services
└── docker/               # Docker configuration
```

## Development

### Running Services Locally

1. Start the database:
   ```bash
   docker-compose up postgres -d
   ```

2. Create the database:
   ```bash
   docker-compose exec postgres psql -U postgres -c "CREATE DATABASE task_service;"
   ```

3. Start all services:
   ```bash
   docker-compose up -d
   ```

### Troubleshooting

1. Database Connection Issues:
   - Ensure PostgreSQL is running: `docker-compose ps`
   - Verify database exists: `docker-compose exec postgres psql -U postgres -l`
   - Check service logs: `docker-compose logs task-service`

2. Service Health Checks:
   - Use the /health endpoints to verify service status
   - Check Docker logs for specific services: `docker-compose logs [service-name]`

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
