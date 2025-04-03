# API Gateway Service

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
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=api_test

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