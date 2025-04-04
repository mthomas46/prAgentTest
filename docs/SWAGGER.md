# Swagger Documentation

This document provides information about the Swagger/OpenAPI documentation available for each service in the system.

## Service Endpoints

### Task Service (Port 3000)
- Swagger UI: http://localhost:3000/api
- Swagger JSON: http://localhost:3000/api-json

**Available Endpoints:**
- `GET /tasks` - Get all tasks
- `GET /health` - Health check endpoint
- `GET /version` - Get service version

### Balder Service (Port 3002)
- Swagger UI: http://localhost:3002/api
- Swagger JSON: http://localhost:3002/api-json

**Available Endpoints:**
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `DELETE /api/tasks/{id}` - Delete a task
- `GET /health` - Health check endpoint
- `GET /version` - Get service version

### Heimdal Service (Port 3003)
- Swagger UI: http://localhost:3003/api
- Swagger JSON: http://localhost:3003/api-json

**Available Endpoints:**
- `GET /heimdal/health/{service}` - Check health of a specific service
- `GET /heimdal/health` - Check health of all services
- `GET /heimdal/services` - Get list of all services

### Webhook Service (Port 3004)
- Swagger UI: http://localhost:3004/api
- Swagger JSON: http://localhost:3004/api-json

**Available Endpoints:**
- Health and monitoring endpoints for webhook service

## Port Configuration

| Service | Internal Port | External Port |
|---------|--------------|---------------|
| Task Service | 3000 | 3000 |
| Balder Service | 3002 | 3002 |
| Heimdal Service | 3003 | 3003 |
| Webhook Service | 3003 | 3004 |

## Authentication

Most endpoints are protected by the `x-brokkr-token` header for service-to-service communication. The token value is configured through environment variables in the Docker Compose configuration.

## Response Formats

All services return responses in JSON format. Common response fields include:

- Health endpoints:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-04-04T06:17:42.538Z",
    "uptime": 2.610219543
  }
  ```

- Version endpoints:
  ```json
  {
    "version": "1.0.0",
    "service": "service-name",
    "environment": "development"
  }
  ```

## Development

To view the Swagger documentation:

1. Start the services:
   ```bash
   docker-compose -f docker-compose.core.yml up -d
   ```

2. Visit the respective Swagger UI endpoints in your browser:
   - Task Service: http://localhost:3000/api
   - Balder Service: http://localhost:3002/api
   - Heimdal Service: http://localhost:3003/api
   - Webhook Service: http://localhost:3004/api

3. The JSON schemas are available at the `/api-json` endpoint for each service.

## Notes

- The Swagger UI provides an interactive interface to test the APIs
- Each service's Swagger documentation includes detailed request/response schemas
- All services support CORS for cross-origin requests
- Rate limiting is implemented on some endpoints
- Health check endpoints are used by Docker for service orchestration 