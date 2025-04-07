# Valkyrie User Management Service

A dedicated user management service for the microservices architecture that handles user operations in the valhalla database.

## Features

- User CRUD operations
- Secure password handling
- Database integration with valhalla
- Health monitoring
- Rate limiting
- CORS protection

## API Endpoints

### User Management
- `POST /api/users` - Create a new user
  - Request body: `{ username: string, password: string, usertype: string }`
  - Response: User object (without password)

- `GET /api/users` - Get all users
  - Response: Array of user objects (without passwords)

- `GET /api/users/:id` - Get user by ID
  - Response: User object (without password)

- `PUT /api/users/:id` - Update user
  - Request body: `{ username?: string, password?: string, usertype?: string }`
  - Response: Updated user object (without password)

- `DELETE /api/users/:id` - Delete user
  - Response: 204 No Content

### Authentication
- `POST /api/auth/login` - Authenticate user and get JWT token
- `POST /api/auth/verify` - Verify JWT token and get user information

### Health Check
- `GET /health` - Service health status

## Environment Variables

### Server Configuration
- `NODE_ENV` - Environment (development/production)
- `PORT` - Service port (default: 3005)

### Database Configuration
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name (valhalla)

### JWT Configuration
- `JWT_SECRET` - Secret key for JWT signing

### Logging Configuration
- `LOG_LEVEL` - Log level (info/debug/error)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with required configuration

3. Start the service:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Security Features

- Secure password hashing
- JWT-based authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Environment-based configuration 