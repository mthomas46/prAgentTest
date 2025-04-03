# API Gateway

This is the API Gateway service for the microservices architecture. It acts as a single entry point for all client requests and routes them to the appropriate microservices.

## Features

- Service discovery and registration
- Request routing and load balancing
- API documentation with Swagger
- Health monitoring
- Metrics collection
- Document management
- Task management
- Webhook handling

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- RabbitMQ

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3002
RABBITMQ_URL=amqp://localhost:5672
NODE_ENV=development
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3002/api
```

## License

This project is licensed under the UNLICENSED License. 