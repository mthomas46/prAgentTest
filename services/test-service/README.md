# Heimdal Service

Named after the Norse god Heimdall, the watchman of the gods who guards the Bifrost bridge. This service watches over the entire application, providing immediate health status and version information for all services.

## Description

Like its namesake, Heimdal stands at the edge of the system, monitoring all services and alerting when issues arise. It serves as the central health monitoring service for the entire microservices architecture, providing real-time status information and version tracking for all services.

## Features

- Real-time health monitoring of all services
- Version tracking for each service
- Centralized service registry
- API for health status queries

## API Endpoints

### Health Check
- `GET /heimdal/health/:service` - Check health and version of a specific service
- `GET /heimdal/health` - Check health and versions of all services
- `GET /heimdal/services` - Get list of all services with their versions

## Environment Variables

```env
NODE_ENV=development
PORT=3006
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the service:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Docker

Build and run with Docker:
```bash
docker-compose up -d --build
```

## Testing

Run tests:
```bash
npm test
```

## Norse Mythology Connection

In Norse mythology, Heimdall is the watchman of the gods who guards the Bifrost bridge, which connects Midgard (Earth) to Asgard (the realm of the gods). He has keen eyesight and hearing, can see for hundreds of leagues, and can hear grass growing on the earth and wool on sheep. He is also said to need less sleep than a bird.

Similarly, this service stands watch over the entire application, monitoring the health of all services and providing immediate information about their status and versions. 