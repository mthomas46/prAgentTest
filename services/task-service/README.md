# Task Service

A microservice for managing tasks in a distributed system.

## Features

- Create, read, update, and delete tasks
- Assign tasks to users
- Mark tasks as completed
- Filter tasks by status and assignee
- Swagger API documentation

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 16+

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the service:
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run start:prod
   ```

## Docker

Build and run the service using Docker:

```bash
docker-compose up --build
```

## API Documentation

Once the service is running, access the Swagger documentation at:
```
http://localhost:3002/api
```

## API Endpoints

- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PUT /tasks/:id/complete` - Mark a task as completed
- `PUT /tasks/:id/assign` - Assign a task to a user
- `GET /tasks/status/:status` - Get tasks by status
- `GET /tasks/assignee/:userId` - Get tasks by assignee

## Testing

Run tests:
```bash
npm test
```

## License

MIT 