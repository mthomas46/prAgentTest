# 📚 Swagger Documentation

## 📋 Overview
This document provides comprehensive information about the Swagger/OpenAPI documentation for our microservices architecture.

## 🎯 Purpose
- Provide interactive API documentation
- Enable API testing through the Swagger UI
- Generate client SDKs
- Validate API requests and responses

## 🔧 Configuration

### 📦 Dependencies
```json
{
  "@nestjs/swagger": "^7.0.0",
  "swagger-ui-express": "^4.6.0"
}
```

### ⚙️ Setup
1. Install dependencies:
```bash
npm install @nestjs/swagger swagger-ui-express
```

2. Configure Swagger in `main.ts`:
```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Microservices API')
  .setDescription('API documentation for the microservices architecture')
  .setVersion('1.0')
  .addTag('tasks')
  .addTag('users')
  .addTag('auth')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

## 📝 API Documentation

### 🔐 Authentication
- JWT Bearer token authentication
- OAuth2 support
- API key authentication

### 📡 Endpoints

#### Tasks Service
```typescript
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  async findAll() {
    // Implementation
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    // Implementation
  }
}
```

#### Users Service
```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async findAll() {
    // Implementation
  }
}
```

## 🎨 Swagger UI Customization

### 🎯 Custom Theme
```typescript
SwaggerModule.setup('api-docs', app, document, {
  customSiteTitle: 'Microservices API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
});
```

### 📱 Responsive Design
- Mobile-friendly interface
- Collapsible sections
- Search functionality
- Dark mode support

## 🔍 API Testing

### 📋 Testing Features
- Interactive API testing
- Request/response validation
- Authentication testing
- Error handling simulation

### 🚀 Example Requests
```bash
# Get all tasks
curl -X GET http://localhost:3000/tasks

# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New Task", "description": "Task description"}'
```

## 📊 API Metrics

### 📈 Usage Statistics
- Request count
- Response times
- Error rates
- API version usage

### 📉 Performance Monitoring
- Latency tracking
- Throughput measurement
- Error tracking
- Rate limiting

## 🔒 Security

### 🛡️ Security Features
- API key validation
- JWT token verification
- Rate limiting
- CORS configuration

### 🔐 Authentication Methods
1. JWT Bearer Token
2. OAuth2
3. API Key
4. Basic Auth

## 📚 Additional Resources

### 📖 Documentation
- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)

### 🛠️ Tools
- Swagger Editor
- Swagger Codegen
- Swagger Inspector
- Postman

## 🔄 Version Control

### 📦 Versioning Strategy
- Semantic versioning
- API version headers
- Backward compatibility
- Deprecation notices

### 📝 Changelog
- API changes
- Breaking changes
- New features
- Bug fixes

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