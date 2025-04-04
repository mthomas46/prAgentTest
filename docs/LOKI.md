# Loki Documentation

## Overview

Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation system inspired by Prometheus. It is designed to be very cost effective and easy to operate, as it does not index the contents of the logs, but rather a set of labels for each log stream.

## Architecture

### Components

1. **Loki Server**
   - Handles log ingestion and querying
   - Manages log streams and labels
   - Provides HTTP API endpoints

2. **Promtail**
   - Log collection agent
   - Discovers targets and attaches labels
   - Pushes logs to Loki

3. **Grafana**
   - Visualization and query interface
   - Log exploration and analysis
   - Dashboard creation

## Configuration

### Loki Server

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

common:
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://localhost:9093
```

### Promtail Configuration

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: varlogs
          __path__: /var/log/*log
```

## Integration with Services

### Task Service Logging

```yaml
logging:
  level: info
  format: json
  labels:
    service: task-service
    environment: development
```

### UI Service Logging

```yaml
logging:
  level: info
  format: json
  labels:
    service: ui-service
    environment: development
```

### Heimdal Logging

```yaml
logging:
  level: info
  format: json
  labels:
    service: heimdal
    environment: development
```

## Querying Logs

### LogQL Examples

1. **Basic Log Query**
```logql
{service="task-service"}
```

2. **Filter by Log Level**
```logql
{service="ui-service"} |= "error"
```

3. **Time Range Query**
```logql
{service="heimdal"} |~ ".*error.*" [5m]
```

4. **Label Filtering**
```logql
{service=~"task-service|ui-service"} | json | environment="development"
```

## Grafana Integration

### Dashboard Setup

1. Add Loki as a data source in Grafana
2. Configure the Loki URL (http://loki:3100)
3. Create log exploration panels
4. Set up alert rules based on log patterns

### Example Dashboard Queries

1. **Error Rate**
```logql
sum(count_over_time({service=~".*"} |~ ".*error.*" [5m])) by (service)
```

2. **Request Latency**
```logql
{service="task-service"} | json | latency > 1000
```

3. **Service Health**
```logql
{service=~".*"} | json | status="healthy"
```

## Best Practices

1. **Label Management**
   - Use meaningful labels
   - Keep label cardinality low
   - Use consistent label names

2. **Log Formatting**
   - Use structured logging (JSON)
   - Include relevant context
   - Maintain consistent log levels

3. **Query Optimization**
   - Use specific label filters
   - Limit time ranges
   - Use appropriate log parsers

4. **Resource Management**
   - Monitor storage usage
   - Set appropriate retention periods
   - Configure resource limits

## Monitoring and Alerts

### Key Metrics

1. **Ingestion Rate**
```logql
sum(rate(loki_distributor_bytes_received_total[5m])) by (service)
```

2. **Query Performance**
```logql
sum(rate(loki_query_frontend_queries_total[5m])) by (service)
```

3. **Error Rate**
```logql
sum(rate(loki_distributor_dropped_samples_total[5m])) by (service)
```

### Alert Rules

```yaml
groups:
  - name: loki_alerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(loki_distributor_dropped_samples_total[5m])) by (service) > 0
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High error rate in Loki
          description: Service {{ $labels.service }} is dropping samples
```

## Troubleshooting

### Common Issues

1. **High Cardinality**
   - Symptoms: Slow queries, high memory usage
   - Solution: Review label usage, reduce cardinality

2. **Storage Issues**
   - Symptoms: Failed writes, high disk usage
   - Solution: Check storage configuration, adjust retention

3. **Query Performance**
   - Symptoms: Slow response times
   - Solution: Optimize queries, add appropriate indexes

### Diagnostic Commands

```bash
# Check Loki health
curl http://localhost:3100/ready

# Query logs
curl -G -s "http://localhost:3100/loki/api/v1/query" \
  --data-urlencode 'query={service="task-service"}'

# Check storage
du -sh /tmp/loki/*
```

## Future Improvements

1. Implement log retention policies
2. Add log compression
3. Enhance query performance
4. Add more visualization options
5. Implement log archiving
6. Add log sampling capabilities
7. Enhance security features
8. Add multi-tenancy support
9. Implement log replay
10. Add log transformation capabilities 