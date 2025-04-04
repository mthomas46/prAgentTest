# Sigrun Authentication Service

A dedicated authentication service for the microservices architecture that handles user authentication and token verification.

## Features

- JWT-based authentication
- Token verification
- Secure password handling
- Database integration with valhalla
- Health monitoring
- Rate limiting
- CORS protection

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate user and get JWT token
- `POST /api/auth/verify` - Verify JWT token and get user information

### Health Check
- `GET /health` - Service health status

## Environment Variables

### Server Configuration
- `NODE_ENV` - Environment (development/production)
- `PORT` - Service port (default: 3006)

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

- JWT-based authentication
- Secure password hashing
- Rate limiting
- CORS protection
- Helmet security headers
- Environment-based configuration 