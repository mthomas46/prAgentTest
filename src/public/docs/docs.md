# Express TypeScript API Documentation

Welcome to the Express TypeScript API documentation. This API provides a modern, type-safe interface built with Express.js and TypeScript.

## Overview

The API is designed with the following principles:
- Type safety with TypeScript
- Clean and consistent API design
- Comprehensive documentation
- Built-in health monitoring
- Interactive API exploration with Swagger UI

## Quick Links

- [API Reference](api) - Detailed API endpoint documentation
- [Health Check](health) - Health monitoring endpoints
- [Swagger UI](/swagger) - Interactive API documentation
- [API Overview](/api) - Quick endpoint reference

## Features

### Type Safety
Built with TypeScript, providing compile-time type checking and better development experience.

### Documentation
- Markdown-based documentation with syntax highlighting
- Interactive Swagger UI documentation
- HTML and Markdown response formats

### Health Monitoring
- Basic and detailed health check endpoints
- Memory usage statistics
- Process information

### API Design
- RESTful endpoints
- Consistent response formats
- Proper error handling
- Rate limiting

## Getting Started

1. Base URL: `http://localhost:8090/api`
2. No authentication required (all endpoints are public)
3. Supports both JSON and HTML responses
4. Rate limited to 100 requests per 15 minutes

## Response Format

All API responses follow this structure:

```json
{
    "data": {}, // The actual response data
    "meta": {
        "timestamp": "2024-04-02T08:00:00.000Z",
        "requestId": "unique-request-id"
    }
}
```

## Error Handling

Error responses follow this format:

```json
{
    "error": "Error Type",
    "message": "Human-readable error message",
    "statusCode": 400,
    "details": {} // Optional additional error details
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth    | Authenticate user |
| GET    | /auth/me | Get current user |

### Resources

#### Users

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
```

> **Note**: All timestamps are in UTC.

## Best Practices

1. Always include your API key in the `Authorization` header
2. Use appropriate HTTP methods
3. Handle errors gracefully
4. Implement proper retry logic

## Support

For additional support, please:

- Visit our [documentation](https://docs.example.com)
- Join our [Discord community](https://discord.gg/example)
- Contact support at support@example.com 