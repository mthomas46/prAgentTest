# DevOps Tooling Documentation

This document describes the DevOps tools integrated into the project, their purposes, and how to use them.

## Overview

The project includes several DevOps tools for monitoring, observability, and metrics collection:

- Prometheus: For metrics collection and storage
- Grafana: For metrics visualization and dashboards
- Node Exporter: For system-level metrics
- Custom application metrics: For business and performance metrics

## Components

### 1. Metrics Collection (Prometheus)

Prometheus is configured to collect metrics from our NestJS application and system. It's set up in `docker-compose.yml` and configured via `prometheus.yml`.

#### Configuration
```yaml
prometheus:
  image: prom/prometheus:latest
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
```

Access the Prometheus UI at: http://localhost:9090

### 2. Metrics Visualization (Grafana)

Grafana provides dashboards for visualizing metrics collected by Prometheus.

#### Configuration
```yaml
grafana:
  image: grafana/grafana:latest
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

Access Grafana at: http://localhost:3001
- Default username: admin
- Default password: admin

### 3. Application Metrics

The application includes custom metrics implemented using the `@willsoto/nestjs-prometheus` package.

#### Available Metrics

1. HTTP Request Counter:
   - Metric: `http_requests_total`
   - Labels: method, path, status
   - Purpose: Track API endpoint usage and response codes

2. HTTP Request Duration:
   - Metric: `http_request_duration_seconds`
   - Labels: method, path
   - Purpose: Monitor API endpoint performance
   - Buckets: 0.1s, 0.5s, 1s, 2s, 5s

#### Accessing Metrics

Application metrics are available at: http://localhost:3000/v1/metrics

## Usage

### Starting the Stack

1. Start all services:
```bash
docker-compose up -d
```

2. Start only monitoring stack:
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

### Viewing Metrics

1. Raw metrics: http://localhost:3000/v1/metrics
2. Prometheus UI: http://localhost:9090
3. Grafana dashboards: http://localhost:3001

### Setting up Grafana Dashboards

1. Log into Grafana
2. Add Prometheus as a data source:
   - URL: http://prometheus:9090
   - Access: Server (default)
3. Import or create dashboards using the metrics:
   - `http_requests_total`: For request counts
   - `http_request_duration_seconds`: For latency metrics

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   NestJS    │────▶│  Prometheus │────▶│   Grafana   │
│ Application │     │   Metrics   │     │ Dashboards  │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Best Practices

1. Metric Naming:
   - Use snake_case for metric names
   - Include units in metric names (e.g., _seconds, _bytes)
   - Use descriptive label names

2. Label Usage:
   - Keep label cardinality low
   - Use meaningful label values
   - Avoid high-cardinality labels

3. Monitoring:
   - Set up alerts for critical metrics
   - Monitor error rates and latencies
   - Track system resource usage

## Troubleshooting

Common issues and solutions:

1. Metrics endpoint not accessible:
   - Check if the application is running
   - Verify the metrics endpoint URL
   - Check for any error logs

2. Prometheus not collecting metrics:
   - Verify Prometheus configuration
   - Check target status in Prometheus UI
   - Ensure network connectivity between services

3. Grafana not showing data:
   - Verify data source configuration
   - Check Prometheus query syntax
   - Ensure time range is set correctly 