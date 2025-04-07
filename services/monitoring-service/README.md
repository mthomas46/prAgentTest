# Monitoring Service

A microservice for monitoring and collecting metrics in a microservices architecture.

## Features

- Prometheus metrics collection
- Service health monitoring
- HTTP request metrics
- Service status tracking
- Swagger documentation

## Prerequisites

- Node.js 18 or higher
- Docker (optional)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Run the application:
   ```bash
   npm run start:dev
   ```

## Docker

To build and run the service using Docker:

```bash
docker build -t monitoring-service .
docker run -p 3000:3000 monitoring-service
```

## API Documentation

Swagger documentation is available at `http://localhost:3000/api` when the service is running.

## Health Check

The health check endpoint is available at `http://localhost:3000/health`.

## Metrics

Prometheus metrics are available at `http://localhost:3000/metrics`.

## Environment Variables

- `PORT`: Service port (default: 3000)
- `NODE_ENV`: Environment (development/production) 