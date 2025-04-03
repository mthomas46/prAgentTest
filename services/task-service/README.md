# Task Service

A NestJS-based microservice for managing tasks.

## Features

- Create, read, update, and delete tasks
- Soft delete and restore tasks
- PostgreSQL database integration
- RESTful API endpoints
- TypeORM for database operations
- Docker support for containerization

## Prerequisites

- Node.js 18 or later
- PostgreSQL 14 or later
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_service
NODE_ENV=development
PORT=3000
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker-compose up --build
```

## API Endpoints

- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `POST /tasks/:id/restore` - Restore a deleted task

## Testing

```bash
npm run test
npm run test:watch
npm run test:cov
```

## License

This project is licensed under the UNLICENSED License. 