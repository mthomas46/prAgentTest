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
