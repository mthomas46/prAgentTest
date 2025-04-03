# Document Service

A microservice for managing documents in a microservices architecture.

## Features

- CRUD operations for documents
- Document status management
- Health check endpoint
- Swagger documentation
- PostgreSQL database integration

## Prerequisites

- Node.js 18 or higher
- PostgreSQL
- Docker (optional)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the PostgreSQL database
5. Run the application:
   ```bash
   npm run start:dev
   ```

## Docker

To build and run the service using Docker:

```bash
docker build -t document-service .
docker run -p 3003:3003 document-service
```

## API Documentation

Swagger documentation is available at `http://localhost:3003/api` when the service is running.

## Health Check

The health check endpoint is available at `http://localhost:3003/health`.

## Environment Variables

- `PORT`: Service port (default: 3003)
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USERNAME`: Database username (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)
- `DB_DATABASE`: Database name (default: documents)
- `NODE_ENV`: Environment (development/production) 