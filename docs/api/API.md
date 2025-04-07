# API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
4. [Models](#models)
5. [Examples](#examples)

## Overview

The Yggdrasil API provides a comprehensive set of endpoints for interacting with the microservices architecture. The API follows RESTful principles and uses JSON for data exchange.

### Base URL
```
https://api.yggdrasil.com/v1
```

### Content Types
- Request: `application/json`
- Response: `application/json`

### Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Authentication

### API Key Authentication
```http
GET /api/v1/resource
Authorization: Bearer {api_key}
```

### OAuth2 Authentication
```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={client_id}&client_secret={client_secret}
```

### JWT Authentication
```http
GET /api/v1/resource
Authorization: Bearer {jwt_token}
```

## Endpoints

### Balder (UI Service)

#### User Management

##### Get User Profile
```http
GET /users/{user_id}
```

Response:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "roles": ["string"],
  "created_at": "string",
  "updated_at": "string"
}
```

##### Update User Profile
```http
PUT /users/{user_id}
```

Request:
```json
{
  "username": "string",
  "email": "string"
}
```

### Bifrost (Event Bridge)

#### Event Management

##### Publish Event
```http
POST /events
```

Request:
```json
{
  "type": "string",
  "payload": {},
  "metadata": {
    "source": "string",
    "timestamp": "string"
  }
}
```

##### Subscribe to Events
```http
GET /events/subscribe
```

Response (SSE):
```
data: {"type": "string", "payload": {}}
```

### Brokkr (Security)

#### Authentication

##### Login
```http
POST /auth/login
```

Request:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "expires_in": 3600
}
```

##### Refresh Token
```http
POST /auth/refresh
```

Request:
```json
{
  "refresh_token": "string"
}
```

### Loki (Logging)

#### Log Management

##### Search Logs
```http
GET /logs/search
```

Query Parameters:
- `query`: string
- `from`: timestamp
- `to`: timestamp
- `limit`: number

Response:
```json
{
  "logs": [
    {
      "timestamp": "string",
      "level": "string",
      "message": "string",
      "metadata": {}
    }
  ],
  "total": 0
}
```

## Models

### User
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "roles": ["string"],
  "created_at": "string",
  "updated_at": "string"
}
```

### Event
```json
{
  "type": "string",
  "payload": {},
  "metadata": {
    "source": "string",
    "timestamp": "string"
  }
}
```

### Log
```json
{
  "timestamp": "string",
  "level": "string",
  "message": "string",
  "metadata": {}
}
```

## Examples

### Creating a User
```bash
curl -X POST https://api.yggdrasil.com/v1/users \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

### Publishing an Event
```bash
curl -X POST https://api.yggdrasil.com/v1/events \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "user.created",
    "payload": {
      "user_id": "123",
      "username": "newuser"
    },
    "metadata": {
      "source": "balder",
      "timestamp": "2024-04-04T12:00:00Z"
    }
  }'
```

### Searching Logs
```bash
curl -X GET "https://api.yggdrasil.com/v1/logs/search?query=error&from=2024-04-01T00:00:00Z&to=2024-04-04T23:59:59Z&limit=10" \
  -H "Authorization: Bearer {token}"
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Versioning

### API Version Header
```http
GET /api/v1/resource
Accept-Version: 1.0.0
```

### Version History
- v1.0.0: Initial release
- v1.1.0: Added event streaming
- v1.2.0: Enhanced logging capabilities

## SDKs

### JavaScript/TypeScript
```bash
npm install @yggdrasil/api
```

Example usage:
```typescript
import { YggdrasilAPI } from '@yggdrasil/api';

const api = new YggdrasilAPI({
  baseURL: 'https://api.yggdrasil.com/v1',
  apiKey: 'your-api-key'
});

// Get user profile
const user = await api.users.get('user-id');

// Publish event
await api.events.publish({
  type: 'user.created',
  payload: { userId: '123' }
});
```

### Python
```bash
pip install yggdrasil-api
```

Example usage:
```python
from yggdrasil import API

api = API(api_key='your-api-key')

# Get user profile
user = api.users.get('user-id')

# Publish event
api.events.publish(
    type='user.created',
    payload={'userId': '123'}
)
```

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('wss://api.yggdrasil.com/v1/ws');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

### Event Types
- `connect`: Connection established
- `disconnect`: Connection closed
- `error`: Error occurred
- `message`: Regular message

## Testing

### Postman Collection
```bash
# Import collection
curl -X GET https://api.yggdrasil.com/v1/postman/collection
```

### Test Environment
```
https://test-api.yggdrasil.com/v1
```

## Support

### Documentation
- [API Reference](https://docs.yggdrasil.com/api)
- [Getting Started](https://docs.yggdrasil.com/getting-started)
- [Examples](https://docs.yggdrasil.com/examples)

### Contact
- Email: api-support@yggdrasil.com
- Slack: #api-support
- GitHub: [Issues](https://github.com/yggdrasil/api/issues) 