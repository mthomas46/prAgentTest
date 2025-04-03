# Shared Modules

This directory contains shared modules, utilities, and configurations that are used across all microservices.

## Directory Structure

```
shared/
├── config/           # Configuration modules and settings
├── middleware/       # Common middleware components
├── interceptors/     # Global interceptors
├── filters/         # Exception filters
├── guards/          # Authentication and authorization guards
├── pipes/           # Validation and transformation pipes
└── types/           # Shared TypeScript interfaces and types
```

## Modules

### Config Module (`config/`)
- `shared-config.module.ts`: Central configuration module
- Configuration for database, RabbitMQ, Redis, Elasticsearch, etc.
- Environment variable validation and transformation

### Middleware Module (`middleware/`)
- Request ID tracking
- CORS configuration
- Rate limiting
- Compression
- Helmet security headers
- Body parsing
- Cookie parsing
- Session handling

### Interceptors Module (`interceptors/`)
- Response transformation
- Logging
- Timeout handling
- Caching
- Metrics collection

### Filters Module (`filters/`)
- Global exception handling
- Validation errors
- HTTP exceptions
- RPC exceptions

### Guards Module (`guards/`)
- Authentication
- Role-based authorization
- Throttling
- JWT validation

### Pipes Module (`pipes/`)
- Request validation
- Data transformation
- Type conversion
- Array parsing

### Types (`types/`)
- Common interfaces
- DTOs
- Enums
- Utility types

## Usage

Import the shared modules in your service's module:

```typescript
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [SharedModule],
  // ... other module configuration
})
export class YourServiceModule {}
```

## Configuration

Each shared module can be configured through environment variables or through the service's module configuration:

```typescript
@Module({
  imports: [
    SharedModule.forRoot({
      // Module-specific configuration
    }),
  ],
})
export class YourServiceModule {}
```

## Best Practices

1. Keep shared code minimal and focused
2. Avoid circular dependencies
3. Document all shared components
4. Write unit tests for shared functionality
5. Use TypeScript for type safety
6. Follow SOLID principles
7. Maintain backward compatibility 