# Simplified Task Service

A lightweight microservice for managing tasks built with Node.js 18 and Express.

## Features

- Create, read, update, and delete tasks
- Mark tasks as completed
- Assign tasks to users
- Filter tasks by status
- PostgreSQL database with Sequelize ORM
- RESTful API endpoints
- Health check endpoint
- Security middleware (helmet, cors)
- Request logging (morgan)
- Response compression

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Docker (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=task_service
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the service:
   ```bash
   npm start
   ```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Tasks

- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `POST /tasks/:id/complete` - Mark a task as completed
- `POST /tasks/:id/assign/:userId` - Assign a task to a user
- `GET /tasks/status/:status` - Get tasks by status

### Health Check

- `GET /health` - Check service health status

## Docker

Build the Docker image:
```bash
docker build -t task-service .
```

Run the container:
```bash
docker run -p 3000:3000 task-service
```

## Testing

Run tests:
```bash
npm test
```

## License

MIT 