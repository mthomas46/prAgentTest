# Microservices Architecture

This project implements a microservices architecture with the following services:

## Services Overview

### 1. Task Service
- **Port**: 3000
- **Description**: Manages task creation, updates, and tracking
- **Features**:
  - Task CRUD operations
  - Task status management
  - Task assignment
  - Task history tracking

### 2. Valkyrie Service
- **Port**: 3005
- **Description**: User management service
- **Features**:
  - User CRUD operations
  - Role-based access control
  - User profile management
  - Password management
  - User data validation

### 3. Sigrun Service
- **Port**: 3006
- **Description**: Authentication service
- **Features**:
  - User authentication
  - JWT token generation and validation
  - Session management
  - Last login tracking
  - Security features (rate limiting, password hashing)

### 4. Draupnir Load Balancers
- **External**: Port 3003
- **Internal**: Port 3004
- **Description**: Load balancing and routing services
- **Features**:
  - Request routing
  - Load distribution
  - Service discovery
  - Health checks

### 5. Supporting Services
- **PostgreSQL Database**:
  - Port: 5433 (external), 5432 (internal)
  - Stores user data, tasks, and authentication information
  - Uses persistent volume for data storage

- **Loki Logging Service**:
  - Port: 3100
  - Centralized logging solution
  - Log aggregation and search

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Task Service   │     │    Valkyrie     │     │     Sigrun      │
│    (3000)      │     │    (3005)       │     │    (3006)       │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                        │
         │                       │                        │
┌────────┴───────────────────────┴────────────────────────┴────────┐
│                      Draupnir Load Balancers                      │
│              External (3003) / Internal (3004)                    │
└────────────────────────────────┬───────────────────────────────┬─┘
                                 │                               │
                    ┌────────────┴─────────────┐     ┌─────────┴─────────┐
                    │    PostgreSQL (5433)     │     │   Loki (3100)     │
                    └────────────────────────┬─┘     └───────────────────┘
                                           │
                                ┌─────────┴─────────┐
                                │  Postgres Volume  │
                                └───────────────────┘
```

## Getting Started

### Prerequisites
- Docker
- Docker Compose
- Node.js >= 18.0.0

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Start all services:
```bash
docker-compose up -d
```

3. Verify services are running:
```bash
docker-compose ps
```

### Environment Variables

Each service has its own `.env` file with the following structure:

#### Task Service
```env
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=valhalla
LOG_LEVEL=info
```

#### Valkyrie Service
```env
NODE_ENV=development
PORT=3005
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=valhalla
JWT_SECRET=valkyrie-secure-secret-key-123
LOG_LEVEL=info
```

#### Sigrun Service
```env
NODE_ENV=development
PORT=3006
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=valhalla
JWT_SECRET=sigrun-secure-secret-key-123
LOG_LEVEL=info
```

## API Documentation

### Task Service Endpoints
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Valkyrie Service Endpoints
- `POST /api/users` - Create a new user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Sigrun Service Endpoints
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Rate limiting on authentication endpoints
- CORS protection
- Input validation and sanitization
- Secure password storage
- Role-based access control

## Monitoring and Logging

- Centralized logging with Loki
- Health check endpoints for each service
- Docker container metrics
- Database connection monitoring
- Authentication attempt logging

## Development

### Project Structure
```
.
├── docker-compose.yml
├── services/
│   ├── task-service/
│   ├── valkyrie/
│   ├── sigrun/
│   ├── draupnir_external/
│   └── draupnir_internal/
└── README.md
```

### Building Services
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build <service-name>
```

### Testing
Each service contains its own test suite. Run tests with:
```bash
cd services/<service-name>
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
