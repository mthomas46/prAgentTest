# API Reference

This document provides detailed information about the API endpoints, request/response formats, and authentication.

## Authentication

All API requests require authentication using an API key. Include your API key in the `Authorization` header:

```bash
Authorization: Bearer your-api-key
```

### Getting an API Key

1. Sign up for an account at https://api.example.com/signup
2. Navigate to your account settings
3. Generate a new API key

## Endpoints

### Users

#### Get Current User

```http
GET /api/users/me
```

Response:
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-04-02T00:00:00Z"
}
```

#### Update User Profile

```http
PATCH /api/users/me
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com"
}
```

Response:
```json
{
  "id": "user_123",
  "email": "john@example.com",
  "name": "John Smith",
  "updatedAt": "2024-04-02T00:00:00Z"
}
```

### Projects

#### List Projects

```http
GET /api/projects
```

Response:
```json
{
  "projects": [
    {
      "id": "proj_123",
      "name": "My Project",
      "description": "Project description",
      "createdAt": "2024-04-02T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 10
}
```

#### Create Project

```http
POST /api/projects
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description"
}
```

Response:
```json
{
  "id": "proj_123",
  "name": "New Project",
  "description": "Project description",
  "createdAt": "2024-04-02T00:00:00Z"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "details": {
    "field": "name",
    "message": "Name is required"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

## Rate Limiting

- Free tier: 100 requests per minute
- Pro tier: 1000 requests per minute
- Enterprise tier: Custom limits

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1614787200
```

## Best Practices

1. **Error Handling**
   - Always check the response status code
   - Parse error responses for detailed information
   - Implement exponential backoff for retries

2. **Rate Limiting**
   - Monitor rate limit headers
   - Implement request queuing
   - Use bulk operations when available

3. **Authentication**
   - Keep API keys secure
   - Rotate keys regularly
   - Use environment variables for keys

4. **Performance**
   - Use pagination for large datasets
   - Implement caching where appropriate
   - Use compression for large payloads 