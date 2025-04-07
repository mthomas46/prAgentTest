# Core Services Overview

## Service Architecture

The Yggdrasil system consists of several core services, each representing a different aspect of Norse mythology and providing specific functionality.

## Service Descriptions

### Balder (UI Service)
- **Port**: 3002
- **Role**: User interface and API gateway
- **Key Features**:
  - React-based frontend
  - Material-UI components
  - Responsive design
  - Dark/Light themes
- **Documentation**: [Balder Documentation](./BALDER.md)

### Bifrost (Event Bridge)
- **Port**: 3004
- **Role**: Event communication and service mesh
- **Key Features**:
  - Message routing and delivery
  - Event transformation
  - Protocol translation
  - Load balancing
- **Documentation**: [Bifrost Documentation](./BIFROST.md)

### Brokkr (Security)
- **Port**: 3005
- **Role**: Security and authentication
- **Key Features**:
  - JWT token management
  - OAuth2 integration
  - Role-based access control
  - Security monitoring
- **Documentation**: [Brokkr Documentation](./BROKKR.md)

### Loki (Logging)
- **Port**: 3100
- **Role**: Log aggregation and monitoring
- **Key Features**:
  - Log collection and storage
  - Log querying and analysis
  - Real-time monitoring
  - Alert generation
- **Documentation**: [Loki Documentation](./LOKI.md)

## Service Dependencies

### Task Service
- **Port**: 3000
- **Dependencies**:
  - PostgreSQL
  - Redis
  - Brokkr (for authentication)

### Balder
- **Dependencies**:
  - Task Service
  - Brokkr
  - Bifrost

### Bifrost
- **Dependencies**:
  - Redis
  - Brokkr
  - Loki

### Brokkr
- **Dependencies**:
  - Redis
  - PostgreSQL

### Loki
- **Dependencies**:
  - Prometheus
  - Grafana

## Service Communication

### Authentication Flow
1. Client requests access
2. Brokkr validates credentials
3. JWT token issued
4. Token used for subsequent requests

### Event Flow
1. Service publishes event to Bifrost
2. Bifrost routes event to subscribers
3. Subscribers process event
4. Loki logs event details

### Logging Flow
1. Services send logs to Loki
2. Loki stores and indexes logs
3. Grafana visualizes logs
4. Alerts generated for anomalies

## Health Checks

Each service exposes a health check endpoint:
- Task Service: `http://localhost:3000/health`
- Balder: `http://localhost:3002/health`
- Bifrost: `http://localhost:3004/health`
- Brokkr: `http://localhost:3005/health`
- Loki: `http://localhost:3100/health`

## Resource Management

Each service has defined resource limits:
- CPU: 0.5 cores limit, 0.25 cores reservation
- Memory: 512MB limit, 256MB reservation
- PostgreSQL: 1GB memory limit, 512MB reservation

## Security

- Token-based authentication using `BROKKR_TOKEN`
- Service-to-service communication secured
- Health check endpoints for monitoring
- Resource limits to prevent abuse

## Monitoring

- Loki provides comprehensive logging
- Prometheus collects metrics
- Grafana visualizes data
- Health check endpoints for each service
- Performance metrics collection
- Alert generation for anomalies 