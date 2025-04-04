# Heimdal Service

Heimdal is a monitoring and health check service that provides unified health and version information for all services in the system.

## Features

- Individual service health monitoring
- Unified health status endpoint
- Version tracking for all services
- PostgreSQL database monitoring
- Protected shutdown endpoint
- CORS support
- TypeScript implementation

## API Endpoints

### Health Endpoints

#### `GET /health`
Returns Heimdal's own health status.

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-04-04T04:04:48.963Z",
  "uptime": 10.230217546
}
```

#### `GET /services/health`
Returns health status of all monitored services.

Response:
```json
{
  "taskService": {
    "status": "ok",
    "timestamp": "2025-04-04T04:04:48.984Z",
    "uptime": 293.849015802
  },
  "uiService": {
    "status": "ok",
    "timestamp": "2025-04-04T04:04:48.987Z",
    "uptime": 293.896195968
  },
  "postgres": {
    "status": "ok",
    "message": "postgres:5432 - accepting connections"
  }
}
```

### Version Endpoints

#### `GET /version`
Returns Heimdal's version information.

Response:
```json
{
  "version": "1.0.0",
  "service": "heimdal",
  "environment": "development"
}
```

#### `GET /services/version`
Returns version information for all monitored services.

Response:
```json
{
  "taskService": {
    "version": "1.0.0",
    "service": "task-service",
    "environment": "development"
  },
  "uiService": {
    "version": "1.0.0",
    "service": "ui-service",
    "environment": "development"
  },
  "postgres": {
    "version": "PostgreSQL 16.0 on x86_64-pc-linux-musl, compiled by gcc (Alpine 12.2.1_git20220924-r10) 12.2.1 20220924, 64-bit"
  }
}
```

### Management Endpoints

#### `POST /shutdown`
Protected endpoint to gracefully shut down the service. Requires the `x-loki-token` header to match the `LOKI_SHUTDOWN_TOKEN` environment variable.

## Configuration

The service is configured through environment variables:

- `PORT`: Service port (default: 3003)
- `NODE_ENV`: Environment name (default: development)
- `LOKI_SHUTDOWN_TOKEN`: Token for protected shutdown endpoint

## Docker Support

The service includes Docker support with:
- Node.js 18 Alpine base image
- PostgreSQL client tools for database monitoring
- Health check configuration
- Resource limits
- Automatic restart policy

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Run in production mode
npm start

# Run tests
npm test
```

## Integration

The service is integrated into the system through Docker Compose and connects to other services via the internal Docker network. It depends on:

- Task Service
- UI Service
- PostgreSQL

## Security

- CORS enabled for cross-origin requests
- Protected shutdown endpoint
- Environment variable based configuration 