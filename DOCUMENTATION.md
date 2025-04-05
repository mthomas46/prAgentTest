# Microservices System Documentation

## Overview

This document provides comprehensive documentation for the microservices architecture implemented in this project. It details the various services, their configurations, and how they interact with each other.

## Core Services

### Task Service
- **Port**: 3000
- **Purpose**: Handles task management operations
- **Dependencies**: PostgreSQL database
- **Environment Variables**:
  - `NODE_ENV=development`
  - `PORT=3000`
  - `DATABASE_URL=postgresql://postgres:postgres@postgres:5432/task_service`

### Draupnir External
- **Port**: 3003
- **Purpose**: External load balancer that handles incoming traffic from external clients
- **Environment Variables**:
  - `NODE_ENV=development`
  - `PORT=3003`

### Draupnir Internal
- **Port**: 3004
- **Purpose**: Internal load balancer that manages communication between internal services
- **Environment Variables**:
  - `NODE_ENV=development`
  - `PORT=3004`
  - `GATEWAY_URL=http://task-service:3000`
  - `CORE_SERVICES_URL=http://bifrost:3000`

### Balder
- **Port**: 3002
- **Purpose**: Frontend service built with Elm
- **Environment Variables**:
  - `NODE_ENV=development`
  - `PORT=3002`
- **Dependencies**: Task Service

### Bifrost
- **Port**: 3005 (external), 3000 (internal)
- **Purpose**: API Gateway that handles message routing and event processing
- **Dependencies**: RabbitMQ, PostgreSQL
- **Environment Variables**:
  - `PORT=3000`
  - `RABBITMQ_URL=amqp://rabbitmq:5672`
  - `NODE_ENV=development`
  - `DB_HOST=postgres`
  - `DB_PORT=5432`
  - `DB_USERNAME=postgres`
  - `DB_PASSWORD=postgres`
  - `DB_NAME=postgres`

## Supporting Services

### PostgreSQL
- **Port**: 5433 (external), 5432 (internal)
- **Purpose**: Database for storing application data
- **Environment Variables**:
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=postgres`
  - `POSTGRES_DB=task_service`

### Loki
- **Port**: 3100
- **Purpose**: Logging service for collecting and storing application logs

### RabbitMQ
- **Ports**: 5672 (AMQP), 15672 (Management UI)
- **Purpose**: Message broker for asynchronous communication between services

## Network Configuration

All services are connected through the `draupnir_network` Docker network, allowing them to communicate with each other using service names as hostnames.

## Recent Changes

### Bifrost Service Integration
- Added Bifrost service to docker-compose.yml
- Updated Bifrost Dockerfile to include class-transformer and class-validator dependencies
- Fixed CORE_SERVICES_URL to use service name instead of localhost
- Configured Bifrost to run on port 3005 externally and 3000 internally

### Balder Service Updates
- Fixed type mismatch in routeToPage function in Main.elm
- Updated port configuration from 4000 to 3002
- Modified Dockerfile to use the correct build script

## How to Run

To start all services:

```bash
docker-compose up -d
```

To start a specific service:

```bash
docker-compose up -d <service-name>
```

## Service Access

- Task Service API: http://localhost:3000
- Balder Frontend: http://localhost:3002
- Bifrost API Gateway: http://localhost:3005
- Bifrost API Documentation: http://localhost:3005/api
- RabbitMQ Management UI: http://localhost:15672
