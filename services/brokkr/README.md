# Brokkr Service

Brokkr is a specialized service designed to interact with the Hel test database and retrieve test data from other services in the microservices architecture. Named after the Norse dwarf who crafted powerful items, Brokkr serves as the only service capable of directly interacting with Hel, the test database.

## Description

Brokkr is a crucial component in the testing infrastructure, providing a controlled interface to access and manipulate test data. It's designed to be used sparingly, as the test data in Hel is in an unreliable state and should not be used for production purposes.

## Features

- Direct interaction with the Hel test database
- Ability to retrieve data from all other services
- Table inspection and data querying capabilities
- Custom query execution
- Schema inspection

## API Endpoints

### Health Check
- `GET /health` - Check service health status

### Service Data
- `GET /services` - Get data from all services

### Hel Database Operations
- `GET /hel/tables` - List all tables in Hel database
- `GET /hel/tables/:tableName` - Get data from a specific table
- `GET /hel/schema/:tableName` - Get schema for a specific table
- `POST /hel/query` - Execute a custom SQL query

## Environment Variables

```env
NODE_ENV=development
PORT=3007

# Hel Database Configuration
HEL_DB_HOST=localhost
HEL_DB_PORT=5432
HEL_DB_USERNAME=postgres
HEL_DB_PASSWORD=postgres
HEL_DB_DATABASE=hel

# Service URLs
BIFROST_URL=http://localhost:3001
TASK_SERVICE_URL=http://localhost:3000
UI_SERVICE_URL=http://localhost:3002
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`

3. Start the service:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Docker

Build and run with Docker:
```bash
docker-compose up -d --build
```

## Testing

Run tests:
```bash
npm test
```

## Important Notes

- This service should only be used for testing purposes
- The data in Hel is in an unreliable state and should not be used for production
- Always use caution when executing custom queries
- The service is designed to be used sparingly and in controlled environments 