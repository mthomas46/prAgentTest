# Health Check Documentation

This document describes the health check endpoints and their responses.

## Overview

The health check endpoints provide information about the system's status, including:
- API availability
- Database connectivity
- Cache status
- External service dependencies

## Endpoints

### Basic Health Check

```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-04-02T00:00:00Z",
  "version": "1.0.0"
}
```

### Detailed Health Check

```http
GET /health/detailed
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-04-02T00:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "ok",
      "latency": 5,
      "lastCheck": "2024-04-02T00:00:00Z"
    },
    "cache": {
      "status": "ok",
      "latency": 2,
      "lastCheck": "2024-04-02T00:00:00Z"
    },
    "storage": {
      "status": "ok",
      "latency": 10,
      "lastCheck": "2024-04-02T00:00:00Z"
    }
  },
  "system": {
    "uptime": 3600,
    "memory": {
      "total": 8589934592,
      "used": 4294967296,
      "free": 4294967296
    },
    "cpu": {
      "load": 0.5,
      "cores": 4
    }
  }
}
```

## Status Codes

| Status | Description |
|--------|-------------|
| ok     | All systems operational |
| degraded | Some services are degraded but the system is still functional |
| down   | Critical services are unavailable |

## Monitoring

### Health Check Frequency

- Basic health check: Every 30 seconds
- Detailed health check: Every 5 minutes

### Alerting

Alerts are triggered when:
- Status changes from "ok" to "degraded" or "down"
- Service latency exceeds threshold
- System resources are critically low

### Metrics

The following metrics are collected:
- Response time
- Error rate
- Resource usage
- Service availability

## Troubleshooting

### Common Issues

1. **High Latency**
   - Check network connectivity
   - Monitor system resources
   - Review service logs

2. **Service Unavailable**
   - Verify service configuration
   - Check for recent deployments
   - Review error logs

3. **Resource Exhaustion**
   - Monitor system metrics
   - Review resource limits
   - Consider scaling resources

### Logging

Health check logs are available at:
- `/var/log/health/health.log`
- `/var/log/health/detailed.log`

Log format:
```
[timestamp] [level] [service] [message]
```

## Best Practices

1. **Monitoring**
   - Set up automated monitoring
   - Configure appropriate alerts
   - Regular review of metrics

2. **Response Time**
   - Keep health checks lightweight
   - Use appropriate timeouts
   - Monitor for degradation

3. **Security**
   - Limit access to detailed health checks
   - Use authentication for sensitive endpoints
   - Regular security audits

4. **Maintenance**
   - Regular system updates
   - Proactive issue resolution
   - Documentation updates 