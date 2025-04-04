# Architecture Documentation

## Overview

The application follows a microservices architecture with a Norse mythology theme. Each service represents a different aspect of the Norse pantheon, providing specific functionality while maintaining loose coupling and high cohesion.

## Service Architecture

### Task Service (Port: 3000)
The Task Service is the core service responsible for task management. It handles:
- Task creation, retrieval, and updates
- Task status management
- Task prioritization
- Task categorization

### Balder (Port: 3002)
Balder, the God of Light and Purity, serves as the radiant face of the application. As the most beautiful and beloved of the gods, Balder provides:
- A shining interface for user interaction
- Pure and intuitive user experience
- Illumination of application features
- Harmonious integration of services

### Heimdal (Port: 3003)
Heimdal, the Watchman of the Gods, serves as the guardian and monitor of the system. With his keen senses and unwavering vigilance, Heimdal provides:
- System health monitoring
- Performance metrics collection
- Alert generation
- Service status tracking

### PostgreSQL (Port: 5432)
The primary database service that stores:
- Task data
- User information
- Service configurations
- System state

## Service Dependencies

- Task Service depends on PostgreSQL
- Balder depends on Task Service
- Heimdal depends on both Task Service and Balder

## Health Checks

Each service exposes a health check endpoint:
- Task Service: `http://localhost:3000/health`
- Balder: `http://localhost:3002/health`
- Heimdal: `http://localhost:3003/health`

## Resource Management

Each service has defined resource limits:
- CPU: 0.5 cores limit, 0.25 cores reservation
- Memory: 512MB limit, 256MB reservation
- PostgreSQL: 1GB memory limit, 512MB reservation

## Environment Variables

### Task Service
- `NODE_ENV`: Environment (development/production)
- `PORT`: Service port (3000)
- `POSTGRES_HOST`: PostgreSQL host
- `POSTGRES_PORT`: PostgreSQL port
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `BROKKR_TOKEN`: Security token

### Balder
- `NODE_ENV`: Environment (development/production)
- `PORT`: Service port (3002)
- `TASK_SERVICE_URL`: Task Service URL
- `BROKKR_TOKEN`: Security token

### Heimdal
- `NODE_ENV`: Environment (development/production)
- `PORT`: Service port (3003)
- `TASK_SERVICE_URL`: Task Service URL
- `BALDER_URL`: Balder URL
- `BROKKR_TOKEN`: Security token

## Security

- Token-based authentication using `BROKKR_TOKEN`
- Service-to-service communication secured
- Health check endpoints for monitoring
- Resource limits to prevent abuse

## Monitoring

- Heimdal provides comprehensive monitoring
- Health check endpoints for each service
- Performance metrics collection
- Alert generation for anomalies

## Future Improvements

1. Implement service discovery
2. Add load balancing
3. Enhance monitoring capabilities
4. Implement caching
5. Add rate limiting
6. Enhance security measures
7. Implement backup strategies
8. Add service mesh
9. Implement circuit breakers
10. Add distributed tracing 