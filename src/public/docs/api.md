# API Reference

This document provides detailed information about all available API endpoints, their request/response formats, and examples.

## Base URL

All API endpoints are prefixed with:
```
http://localhost:8090/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Common Headers

- `Accept`: Specify response format (`application/json`, `text/html`, `text/markdown`)
- `Content-Type`: For requests with body, use `application/json`

## Endpoints

### Health Check

#### Get Basic Health Status
```http
GET /api/health
```

Returns basic health status information including uptime and memory usage.

**Response**
```json
{
    "status": "ok",
    "timestamp": "2024-04-02T08:00:00.000Z",
    "uptime": 3600,
    "memoryUsage": {
        "heapUsed": 123456789,
        "heapTotal": 987654321,
        "external": 123456789
    }
}
```

#### Get Detailed Health Status
```http
GET /api/health/detailed
```

Returns detailed health information including memory usage statistics and process information.

**Response**
```json
{
    "status": "ok",
    "timestamp": "2024-04-02T08:00:00.000Z",
    "uptime": 3600,
    "memoryUsage": {
        "heapUsed": 123456789,
        "heapTotal": 987654321,
        "external": 123456789,
        "rss": 123456789
    },
    "process": {
        "pid": 12345,
        "version": "v18.0.0",
        "platform": "darwin",
        "arch": "x64"
    }
}
```

### Documentation

#### Get Documentation
```http
GET /api/docs/{filename}
```

Retrieve documentation in either HTML or Markdown format.

**Parameters**
- `filename` (string) - Name of the documentation file to retrieve
  - `docs` - Overview documentation
  - `api` - API reference
  - `health` - Health check documentation

**Headers**
- `Accept: text/html` - Returns rendered HTML
- `Accept: text/markdown` - Returns raw Markdown

**Response (HTML)**
```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

**Response (Markdown)**
```http
HTTP/1.1 200 OK
Content-Type: text/markdown

# API Documentation
...
```

### API Overview

#### Get API Overview
```http
GET /api
```

Returns an overview of the API, including available endpoints and version information.

**Response**
```json
{
    "name": "Express TypeScript API",
    "version": "1.0.0",
    "description": "A modern API built with Express.js and TypeScript",
    "endpoints": [
        {
            "path": "/api/health",
            "method": "GET",
            "description": "Basic health check"
        },
        {
            "path": "/api/health/detailed",
            "method": "GET",
            "description": "Detailed health information"
        }
    ]
}
```

## Error Handling

All error responses follow this format:

```json
{
    "error": "Error Type",
    "message": "Human-readable error message",
    "statusCode": 400,
    "details": {} // Optional additional error details
}
```

Common error types:
- `BadRequest` - Invalid request parameters
- `NotFound` - Resource not found
- `InternalError` - Server error

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- 100 requests per 15 minutes per IP address
- Rate limit headers included in responses:
  - `X-RateLimit-Limit` - Maximum requests per window
  - `X-RateLimit-Remaining` - Remaining requests in current window
  - `X-RateLimit-Reset` - Time when the rate limit window resets

## Response Format

All successful API responses follow this structure:

```json
{
    "data": {}, // The actual response data
    "meta": {
        "timestamp": "2024-04-02T08:00:00.000Z",
        "requestId": "unique-request-id"
    }
}
``` 