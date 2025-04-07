# Draupnir External

Named after the legendary golden ring crafted by the dwarves Brokkr and Sindri, Draupnir External embodies the essence of abundance and prosperity in the digital realm. Just as the mythical Draupnir produces eight new rings every ninth night, our service multiplies and distributes traffic with remarkable efficiency, ensuring the continuous flow and prosperity of your application ecosystem.

## The Legend Behind the Name

In Norse mythology, Draupnir was a magical golden ring that symbolized abundance and prosperity, creating eight new rings of equal weight every ninth night. Similarly, our Draupnir External service:

- Multiplies and distributes traffic with remarkable efficiency
- Ensures continuous flow and system prosperity
- Maintains balance and harmony in the application ecosystem
- Protects and enhances the value of each request

## Technical Overview

Draupnir External is a sophisticated load balancer service that serves as the primary gateway for external traffic entering the application ecosystem. Positioned strategically between Heimdal and Bifrost services, it acts as a traffic conductor, ensuring optimal request distribution while implementing robust security measures and performance optimizations.

## Key Responsibilities

- Acts as the primary entry point for all external traffic
- Intelligently routes requests between Heimdal and Bifrost services
- Implements security measures to protect internal services
- Optimizes traffic flow and prevents service overload
- Provides real-time monitoring and health checks
- Ensures high availability and fault tolerance

## Features

- Load balancing between multiple services
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
PORT=3003
BIFROST_URL=http://localhost:3001
HEIMDAL_URL=http://localhost:3002
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
- `GET /bifrost/*` - Routes to Bifrost service
- `GET /heimdal/*` - Routes to Heimdal service

## License

MIT 