# Draupnir Internal

Named after the legendary golden ring crafted by the dwarves Brokkr and Sindri, Draupnir Internal embodies the essence of abundance and harmony in the internal service communication. Just as the mythical Draupnir produces eight new rings every ninth night, our service multiplies and distributes internal traffic with remarkable efficiency, ensuring the continuous flow and harmony of your microservices ecosystem.

## The Legend Behind the Name

In Norse mythology, Draupnir was a magical golden ring that symbolized abundance and prosperity, creating eight new rings of equal weight every ninth night. Similarly, our Draupnir Internal service:

- Multiplies and distributes internal traffic with remarkable efficiency
- Ensures continuous flow and system harmony
- Maintains balance between core services and gateway
- Protects and enhances the value of each internal request

## Technical Overview

Draupnir Internal is a sophisticated load balancer service that serves as the primary orchestrator for internal service communication. Positioned strategically between core microservices and the gateway, it acts as a traffic conductor, ensuring optimal request distribution while implementing robust security measures and performance optimizations.

## Key Responsibilities

- Acts as the primary orchestrator for internal service communication
- Intelligently routes requests between core services and gateway
- Implements security measures for internal service protection
- Optimizes internal traffic flow and prevents service overload
- Provides real-time monitoring and health checks
- Ensures high availability and fault tolerance for internal services

## Features

- Load balancing between core services and gateway
- Health check endpoints
- Request logging
- Error handling
- Rate limiting
- CORS support
- Security headers

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3004
GATEWAY_URL=http://localhost:3000
CORE_SERVICES_URL=http://localhost:3005
NODE_ENV=development
```

### Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

### Docker

Build and run with Docker:
```bash
docker-compose up --build
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /gateway/*` - Routes to Gateway service
- `GET /core/*` - Routes to Core Services

## License

MIT 