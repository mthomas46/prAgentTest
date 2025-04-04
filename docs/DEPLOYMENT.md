# Deployment Guide

## Overview

This guide provides instructions for deploying the microservices architecture using Docker Compose. The system consists of several services, each with specific roles and configurations.

## Prerequisites

- Docker Engine >= 24.0.0
- Docker Compose >= 2.20.0
- Minimum 4GB RAM
- Minimum 2 CPU cores

## Service Configuration

### Core Services

#### Task Service
- Port: 3000
- Health Check: `http://localhost:3000/health`
- Environment Variables:
  - `NODE_ENV`: development
  - `PORT`: 3000
  - `POSTGRES_HOST`: postgres
  - `POSTGRES_PORT`: 5432
  - `POSTGRES_USER`: postgres
  - `POSTGRES_PASSWORD`: postgres
  - `POSTGRES_DB`: taskdb
  - `BROKKR_TOKEN`: brokkr-secure-token-123

#### Balder
- Port: 3002
- Health Check: `http://localhost:3002/health`
- Environment Variables:
  - `NODE_ENV`: development
  - `PORT`: 3002
  - `TASK_SERVICE_URL`: http://task-service:3000
  - `BROKKR_TOKEN`: brokkr-secure-token-123

#### Heimdal
- Port: 3003
- Health Check: `http://localhost:3003/health`
- Environment Variables:
  - `NODE_ENV`: development
  - `PORT`: 3003
  - `TASK_SERVICE_URL`: http://task-service:3000
  - `BALDER_URL`: http://balder:3002
  - `BROKKR_TOKEN`: brokkr-secure-token-123

#### PostgreSQL
- Port: 5432
- Health Check: Automatic via `pg_isready`
- Environment Variables:
  - `POSTGRES_USER`: postgres
  - `POSTGRES_PASSWORD`: postgres
  - `POSTGRES_DB`: taskdb

### Monitoring Services

#### Kibana
- Port: 5601
- Access: `http://localhost:5601`
- Purpose: Visualization and analytics

#### Logstash
- Ports: 5000, 5044, 9600
- Purpose: Log processing and analysis

#### Node Exporter
- Port: 9100
- Purpose: System metrics collection

#### Ngrok
- Port: 4040
- Purpose: Secure tunnel to localhost

## Deployment Steps

1. Clone the repository
2. Set up environment variables
3. Build and start services:
```bash
docker-compose -f docker-compose.core.yml up -d --build
```

## Health Check URLs

- Task Service: `http://localhost:3000/health`
- Balder: `http://localhost:3002/health`
- Heimdal: `http://localhost:3003/health`
- PostgreSQL: Automatic health check

## Resource Limits

### Task Service
- CPU: 0.5 cores limit, 0.25 cores reservation
- Memory: 512MB limit, 256MB reservation

### Balder
- CPU: 0.5 cores limit, 0.25 cores reservation
- Memory: 512MB limit, 256MB reservation

### Heimdal
- CPU: 0.5 cores limit, 0.25 cores reservation
- Memory: 512MB limit, 256MB reservation

### PostgreSQL
- CPU: 0.5 cores limit, 0.25 cores reservation
- Memory: 1GB limit, 512MB reservation

## Monitoring Access

- Kibana: `http://localhost:5601`
- Logstash: Ports 5000, 5044, 9600
- Node Exporter: `http://localhost:9100/metrics`
- Ngrok: `http://localhost:4040`

## Troubleshooting

1. Check service logs:
```bash
docker-compose -f docker-compose.core.yml logs [service-name]
```

2. Verify service health:
```bash
curl http://localhost:[port]/health
```

3. Check resource usage:
```bash
docker stats
```

## Maintenance

1. Regular backups of PostgreSQL data
2. Monitor resource usage
3. Update security tokens regularly
4. Review and rotate logs
5. Update service configurations as needed

## Security Considerations

1. Secure token management
2. Network segmentation
3. Resource limits
4. Regular updates
5. Access control
6. Monitoring and alerting
7. Backup strategies
8. Encryption at rest
9. Secure communication
10. Regular security audits 