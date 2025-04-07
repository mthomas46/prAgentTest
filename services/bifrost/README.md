# Bifrost API Gateway

Bifrost is a powerful API Gateway service that acts as a central entry point for all microservices in the architecture. Named after the rainbow bridge in Norse mythology that connects the mortal world to the realm of the gods, Bifrost connects clients to various microservices while providing essential functionality:

## Features

- **Request Routing**: Intelligently routes requests to appropriate microservices
- **Load Balancing**: Distributes traffic across service instances
- **Authentication & Authorization**: Secures the API endpoints
- **Request/Response Transformation**: Modifies requests and responses as needed
- **Service Discovery**: Automatically detects and registers services
- **Monitoring & Logging**: Tracks service health and performance
- **Rate Limiting**: Protects services from overload
- **Circuit Breaking**: Prevents cascade failures
- **API Documentation**: Swagger/OpenAPI documentation
- **CORS Support**: Handles cross-origin resource sharing
- **Error Handling**: Unified error handling and response formatting

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL
- Redis (optional, for caching)

### Installation

```bash
npm install
```

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker build -t bifrost .
docker run -p 3001:3001 bifrost
```

### Configuration

Environment variables:

```env
NODE_ENV=development
PORT=3001
TASK_SERVICE_URL=http://task-service:3000
UI_SERVICE_URL=http://ui-service:3002
```

### API Documentation

Once the service is running, visit:
- Swagger UI: http://localhost:3001/api
- API Docs: http://localhost:3001/api-docs

## Monitoring

The service exposes metrics at:
- Health Check: http://localhost:3001/health
- Metrics: http://localhost:3001/metrics

## Architecture

Bifrost is built with:
- Node.js & Express
- TypeScript
- OpenTelemetry for tracing
- Prometheus for metrics
- Winston for logging
- Swagger for API documentation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Overview
The API Gateway serves as the central entry point for all client requests in our microservices architecture. It orchestrates communication between various services and provides a unified API interface.

## Architecture

### Service Modules
The API Gateway integrates several specialized modules:

1. **Task Module**
   - Handles task-related operations
   - Communicates with the task service via RabbitMQ
   - Implements task CRUD operations, status updates, and assignments
   - Uses message queues for asynchronous communication

2. **Webhook Module**
   - Manages webhook functionality
   - Handles incoming webhook requests
   - Routes webhook events to appropriate services
   - Implements webhook security and validation

3. **Monitoring Module**
   - Provides system observability
   - Collects metrics and logs
   - Integrates with Prometheus and Grafana
   - Offers health check endpoints

4. **Service Discovery Module**
   - Manages service registration and discovery
   - Maintains service health checks
   - Handles load balancing between service instances
   - Provides service routing information

5. **Document Module**
   - Handles document-related operations
   - Manages document upload/download
   - Coordinates document processing
   - Integrates with document storage services

## Communication Patterns

### Message Broker Integration
The API Gateway uses RabbitMQ for asynchronous communication with other services:

```typescript
{
  name: 'TASK_SERVICE',
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
    queue: 'task_queue',
    queueOptions: {
      durable: false
    }
  }
}
```

### Service-to-Service Communication
- Synchronous: HTTP/REST for direct service calls
- Asynchronous: RabbitMQ for event-driven communication
- Service Discovery: Dynamic routing to service instances

## Configuration

### Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=bifrost

# Application Configuration
PORT=3002
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:8090
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
JSON_BODY_LIMIT=10kb

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret_here

# Message Broker
RABBITMQ_URL=amqp://localhost:5672
```

## Monitoring and Observability

### Metrics Collection
- Prometheus metrics endpoint
- Custom business metrics
- System performance metrics
- Service health metrics

### Logging
- Structured JSON logging
- Log levels: error, warn, info, debug
- Context-aware logging
- Log aggregation with Elasticsearch

### Tracing
- Distributed tracing
- Request correlation
- Performance monitoring
- Error tracking

## Security

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- API key authentication
- Webhook signature verification

### Rate Limiting
- Global rate limiting
- Per-route rate limiting
- IP-based rate limiting
- User-based rate limiting

## Development

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- RabbitMQ
- PostgreSQL

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start required services:
   ```bash
   docker-compose up -d
   ```

3. Run the application:
   ```bash
   npm run start:dev
   ```

### Testing
```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## API Documentation

### Swagger UI
Access the API documentation at:
```
http://localhost:3002/api
```

### Available Endpoints
- Task Management
- Webhook Handling
- Health Checks
- Metrics Collection
- Document Operations

## Deployment

### Docker
```bash
docker build -t api-gateway .
docker run -p 3002:3002 api-gateway
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api-gateway
        image: api-gateway:latest
        ports:
        - containerPort: 3002
```

## Troubleshooting

### Common Issues
1. Database Connection Issues
   - Check database credentials
   - Verify database is running
   - Check network connectivity

2. Message Broker Issues
   - Verify RabbitMQ is running
   - Check queue configurations
   - Monitor message processing

3. Service Discovery Issues
   - Check service registration
   - Verify health check endpoints
   - Monitor service availability

### Logs
Access logs through:
- Docker logs
- Kubernetes logs
- Centralized logging system

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[Add your license information here]

# Database Configuration

## Development
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=bifrost
```

## Testing
```env
# Hel - Test Database
# Named after the Norse realm of the dead, serves as the home for test data.
# Production data can be copied here for testing but will be rolled back after automated tests.
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_USERNAME=postgres
TEST_DB_PASSWORD=postgres
TEST_DB_DATABASE=hel
``` 