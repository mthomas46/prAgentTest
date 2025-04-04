# Loki - The Chaos Service

Loki is our chaos service capable of disrupting all other services in order to test our ability to adapt on the fly. This service should only be interacted with through automated jobs in order to coordinate these 'outages' and thus while it has endpoints it should never be triggered by an actual person directly.

## Description

In Norse mythology, Loki is known as the trickster god who brings chaos and disruption. This service embodies that spirit by providing controlled chaos testing capabilities for our microservices architecture.

## Protected Services

The following services are protected and cannot be brought down:
- Heimdal
- Brokkr

## API Endpoints

### Bring Down a Service
```
POST /api/loki/bring-down/:serviceName
```
Brings down a specified service (except protected services).

### Bring Up a Service
```
POST /api/loki/bring-up/:serviceName
```
Brings up a specified service (except protected services).

### Get Service Status
```
GET /api/loki/status/:serviceName
```
Gets the current status of a specified service.

## Security Warning

⚠️ **IMPORTANT**: This service should only be accessed by automated jobs for controlled chaos testing. Direct human interaction with these endpoints is not recommended and could lead to unintended service disruptions.

## Development

### Prerequisites
- Node.js 18
- Docker
- Docker Compose

### Installation
```bash
npm install
```

### Running the Service
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Docker

Build and run the service using Docker:
```bash
docker build -t loki .
docker run -p 3000:3000 loki
```

## Environment Variables

- `PORT` - The port on which the service will run (default: 3000) 