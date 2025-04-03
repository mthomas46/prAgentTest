# API Gateway Service

The API Gateway service acts as the entry point for all client requests, handling routing, authentication, and request/response transformation.

## Features

- 🔐 Authentication and authorization
- 🚦 Request routing to microservices
- 📝 Request/response transformation
- 🔍 Request validation
- 📊 Rate limiting
- 🛡️ Security headers
- 📈 Metrics collection
- 🎯 Health checks

## Architecture

```
api-gateway/
├── src/
│   ├── auth/           # Authentication and authorization
│   ├── controllers/    # Route handlers
│   ├── dto/           # Data transfer objects
│   ├── filters/       # Exception filters
│   ├── guards/        # Route guards
│   ├── interfaces/    # TypeScript interfaces
│   ├── middleware/    # Custom middleware
│   └── services/      # Business logic
├── test/              # Test files
└── config/            # Service configuration
```

## Configuration

Environment variables:

```env
# Server
PORT=3002
NODE_ENV=development

# Security
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8090

# Logging
LOG_LEVEL=info
```

## API Routes

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - User logout

### Tasks
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Documents
- `GET /documents` - List documents
- `POST /documents` - Upload document
- `GET /documents/:id` - Get document
- `DELETE /documents/:id` - Delete document

### Webhooks
- `POST /webhooks` - Register webhook
- `GET /webhooks` - List webhooks
- `DELETE /webhooks/:id` - Delete webhook

### Health
- `GET /health` - Service health check
- `GET /health/live` - Liveness probe
- `GET /health/ready` - Readiness probe

### Metrics
- `GET /metrics` - Prometheus metrics

## Development

```bash
# Installation
npm install

# Development
npm run start:dev

# Production
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov
```

## Dependencies

- NestJS - Web framework
- Passport - Authentication
- JWT - Token-based auth
- class-validator - Request validation
- class-transformer - Object transformation
- helmet - Security headers
- compression - Response compression
- swagger-ui-express - API documentation

## Error Handling

The service uses a global exception filter that transforms errors into a standard format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "must be an email"
    }
  ]
}
```

## Monitoring

- Prometheus metrics at `/metrics`
- Health checks at `/health`
- OpenTelemetry tracing
- ELK Stack logging

## Security

- JWT authentication
- Role-based access control
- Rate limiting
- CORS protection
- Security headers
- Request validation
- API key authentication for service-to-service communication

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

1. Create a feature branch
2. Make your changes
3. Write tests
4. Update documentation
5. Submit a pull request 