# PR Agent Test API

A modern NestJS-based REST API for task management with TypeScript, PostgreSQL, and Swagger documentation.

## Features

- 🚀 Built with NestJS and TypeScript
- 📝 Task management with CRUD operations
- 🔒 Security features (Helmet, CORS, Rate Limiting)
- 📊 Health monitoring
- 📚 Swagger documentation
- 🗄️ PostgreSQL database with TypeORM
- 🔄 Soft delete functionality
- ⚡ Performance optimizations
- 🛡️ Input validation
- 📝 Request/Response logging
- ⏱️ Request timeout handling

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Docker (optional, for running PostgreSQL)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pr-agent-test
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database:
```bash
createdb pr_agent_test
```

4. Copy the environment file:
```bash
cp .env.example .env
```

5. Update the environment variables in `.env` if needed.

## Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## API Endpoints

### Tasks

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Soft delete a task
- `POST /tasks/:id/restore` - Restore a soft-deleted task

### Health

- `GET /health` - Check application health

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
