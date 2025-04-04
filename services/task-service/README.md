# Task Service

A lean task management service built with TypeScript, Express, and PostgreSQL.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete
- Filter tasks by status
- Assign tasks to users

## Requirements

- Node.js 18
- PostgreSQL 16
- Docker and Docker Compose (optional)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start the service:
   ```bash
   npm run dev
   ```

## Docker Development

1. Build and start the services:
   ```bash
   docker-compose up -d --build
   ```

2. Stop the services:
   ```bash
   docker-compose down
   ```

## API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a task by ID
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PATCH /tasks/:id/complete` - Mark a task as complete

## Task Status

- `OPEN` - Task is open
- `IN_PROGRESS` - Task is in progress
- `DONE` - Task is completed

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
``` 