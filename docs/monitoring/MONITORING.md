# Monitoring Guide

## Table of Contents
1. [Overview](#overview)
2. [Logging](#logging)
3. [Metrics](#metrics)
4. [Alerting](#alerting)
5. [Dashboards](#dashboards)

## Overview

The Yggdrasil monitoring stack provides comprehensive observability across all services. It includes centralized logging, metrics collection, alerting, and visualization capabilities.

### Monitoring Stack
- **Logging**: Loki + Fluentd
- **Metrics**: Prometheus
- **Visualization**: Grafana
- **Alerting**: Alertmanager
- **Tracing**: Jaeger

## Logging

### Loki Configuration

#### Log Collection
```yaml
loki:
  server:
    http_listen_port: 3100
  schema_config:
    configs:
      - from: 2020-05-15
        store: boltdb
        object_store: filesystem
        schema: v11
        index:
          prefix: index_
          period: 24h
```

#### Fluentd Configuration
```yaml
<source>
  @type forward
  port 24224
</source>

<match **>
  @type loki
  url "http://loki:3100"
  <label>
    service ${tag}
  </label>
</match>
```

### Log Levels
- `DEBUG`: Detailed information for debugging
- `INFO`: General operational information
- `WARN`: Warning conditions
- `ERROR`: Error conditions
- `FATAL`: Critical conditions

### Log Format
```json
{
  "timestamp": "2024-04-04T12:00:00Z",
  "level": "INFO",
  "service": "balder",
  "message": "User logged in",
  "user_id": "123",
  "ip": "192.168.1.1"
}
```

### Log Querying

#### LogQL Examples
```logql
# Basic query
{service="balder"} |= "error"

# Time range
{service="balder"} |= "error" |~ ".*failed.*" |~ ".*timeout.*"

# Aggregation
sum by (service) (count_over_time({service=~".*"}[5m]))
```

## Metrics

### Prometheus Configuration

#### Scrape Configuration
```yaml
scrape_configs:
  - job_name: 'balder'
    static_configs:
      - targets: ['balder:3000']
    metrics_path: '/metrics'
    scheme: 'http'

  - job_name: 'bifrost'
    static_configs:
      - targets: ['bifrost:3000']
    metrics_path: '/metrics'
    scheme: 'http'
```

### Key Metrics

#### Service Metrics
- Request rate
- Error rate
- Latency
- CPU usage
- Memory usage
- Disk I/O
- Network traffic

#### Business Metrics
- User activity
- Transaction volume
- Conversion rates
- API usage
- Feature adoption

### PromQL Examples
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m])

# Latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

## Alerting

### Alertmanager Configuration
```yaml
route:
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'slack'

receivers:
- name: 'slack'
  slack_configs:
  - channel: '#alerts'
    api_url: 'https://hooks.slack.com/services/...'
```

### Alert Rules
```yaml
groups:
- name: service_alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High error rate on {{ $labels.service }}
      description: Error rate is {{ $value }} for service {{ $labels.service }}

  - alert: HighLatency
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High latency on {{ $labels.service }}
      description: 95th percentile latency is {{ $value }}s for service {{ $labels.service }}
```

### Notification Channels
- Slack
- Email
- PagerDuty
- Webhooks

## Dashboards

### Grafana Configuration

#### Dashboard Organization
- Service Overview
- Performance Metrics
- Business Metrics
- System Health
- Custom Dashboards

### Key Dashboards

#### Service Overview
- Request rate
- Error rate
- Latency
- Resource usage
- Active users

#### Performance Metrics
- Response times
- Throughput
- Error rates
- Cache hit rates
- Database performance

#### System Health
- CPU usage
- Memory usage
- Disk I/O
- Network traffic
- Container metrics

### Dashboard Variables
```json
{
  "service": {
    "query": "label_values(up, service)",
    "current": {
      "selected": false,
      "text": "All",
      "value": "$__all"
    }
  },
  "timeRange": {
    "from": "now-6h",
    "to": "now"
  }
}
```

## Tracing

### Jaeger Configuration
```yaml
jaeger:
  collector:
    zipkin:
      host-port: :9411
  query:
    base-path: /jaeger
  storage:
    type: elasticsearch
    options:
      es:
        server-urls: http://elasticsearch:9200
```

### Trace Context Propagation
```javascript
const tracer = require('jaeger-client').initTracer({
  serviceName: 'balder',
  sampler: {
    type: 'const',
    param: 1,
  },
  reporter: {
    agentHost: 'jaeger',
    agentPort: 6832,
  },
});
```

## Best Practices

### Logging
- Use structured logging
- Include relevant context
- Set appropriate log levels
- Rotate logs regularly
- Monitor log volume

### Metrics
- Define clear metric names
- Use appropriate metric types
- Set meaningful labels
- Monitor cardinality
- Document metrics

### Alerting
- Set meaningful thresholds
- Avoid alert fatigue
- Include runbooks
- Test alerting pipeline
- Review alert rules

### Dashboards
- Keep dashboards focused
- Use appropriate visualizations
- Include documentation
- Set refresh intervals
- Monitor dashboard load

## Troubleshooting

### Common Issues

#### High Log Volume
1. Check log levels
2. Review log patterns
3. Adjust retention
4. Optimize queries

#### Metric Cardinality
1. Review label usage
2. Optimize queries
3. Adjust scrape intervals
4. Monitor resource usage

#### Alert Noise
1. Review thresholds
2. Adjust grouping
3. Update runbooks
4. Fine-tune rules

### Debug Tools
- LogQL
- PromQL
- Grafana Explore
- Jaeger UI
- Metrics Explorer

## Maintenance

### Regular Tasks
- Review alert rules
- Update dashboards
- Clean up old data
- Monitor resource usage
- Test alerting pipeline

### Backup and Recovery
- Backup configurations
- Export dashboards
- Document procedures
- Test recovery
- Monitor backups 