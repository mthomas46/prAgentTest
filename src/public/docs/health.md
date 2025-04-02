# Health Check Documentation

This document provides detailed information about the health check endpoints available in the API.

## Overview

The health check endpoints allow you to monitor the operational status of the API. They provide both basic and detailed health information, including memory usage statistics and process details.

## Endpoints

### Basic Health Check

```http
GET /api/health
```

Returns basic health status information including uptime and memory usage.

#### Response Format

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

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | Current health status ("ok" or "error") |
| timestamp | string | ISO timestamp of the health check |
| uptime | number | Server uptime in seconds |
| memoryUsage | object | Memory usage statistics |
| memoryUsage.heapUsed | number | Currently used heap memory in bytes |
| memoryUsage.heapTotal | number | Total available heap memory in bytes |
| memoryUsage.external | number | Memory used by external resources in bytes |

### Detailed Health Check

```http
GET /api/health/detailed
```

Returns detailed health information including memory usage statistics and process information.

#### Response Format

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

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| status | string | Current health status ("ok" or "error") |
| timestamp | string | ISO timestamp of the health check |
| uptime | number | Server uptime in seconds |
| memoryUsage | object | Memory usage statistics |
| memoryUsage.heapUsed | number | Currently used heap memory in bytes |
| memoryUsage.heapTotal | number | Total available heap memory in bytes |
| memoryUsage.external | number | Memory used by external resources in bytes |
| memoryUsage.rss | number | Resident Set Size in bytes |
| process | object | Process information |
| process.pid | number | Process ID |
| process.version | string | Node.js version |
| process.platform | string | Operating system platform |
| process.arch | string | CPU architecture |

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | API is healthy and operational |
| 503 | API is experiencing issues |

## Usage Examples

### Basic Health Check

Using curl:
```bash
curl http://localhost:8090/api/health
```

Using JavaScript:
```javascript
const response = await fetch('http://localhost:8090/api/health');
const data = await response.json();
console.log(data);
```

### Detailed Health Check

Using curl:
```bash
curl http://localhost:8090/api/health/detailed
```

Using JavaScript:
```javascript
const response = await fetch('http://localhost:8090/api/health/detailed');
const data = await response.json();
console.log(data);
```

## Monitoring

These endpoints are designed for:
- Load balancer health checks
- Monitoring system integration
- Container orchestration health probes
- Manual system status verification

## Best Practices

1. **Regular Monitoring**
   - Poll the health endpoints at regular intervals
   - Set up alerts for error states
   - Monitor memory usage trends

2. **Response Time**
   - Monitor response times for degradation
   - Set up alerts for slow responses
   - Track uptime statistics

3. **Memory Usage**
   - Monitor memory usage trends
   - Set alerts for high memory usage
   - Track memory leaks

4. **Integration**
   - Use with monitoring systems
   - Integrate with logging solutions
   - Set up automated alerts 