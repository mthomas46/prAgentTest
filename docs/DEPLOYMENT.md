# Deployment Guide

This guide provides instructions for deploying the event-driven microservice architecture in various environments.

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (for production deployment)
- Helm (for Kubernetes deployment)
- kubectl (for Kubernetes management)
- Access to a container registry

## Local Development Deployment

### Using Docker Compose

1. Build the services:
```bash
docker-compose build
```

2. Start the services:
```bash
docker-compose up -d
```

3. Verify the services are running:
```bash
docker-compose ps
```

### Manual Deployment

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the services:
```bash
npm run start:dev
```

## Production Deployment

### Docker Deployment

1. Build the production image:
```bash
docker build -t your-registry/event-service:latest .
```

2. Push the image to your registry:
```bash
docker push your-registry/event-service:latest
```

3. Deploy using Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

1. Create Kubernetes secrets:
```bash
kubectl create secret generic event-service-secrets \
  --from-file=.env
```

2. Deploy using Helm:
```bash
helm install event-service ./helm
```

3. Verify the deployment:
```bash
kubectl get pods
kubectl get services
```

## Configuration

### Environment Variables

Required environment variables for production:

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_DATABASE=api

# RabbitMQ Configuration
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest

# Cache Configuration
CACHE_TTL=300
CACHE_MAX_ITEMS=1000

# Event System Configuration
EVENT_BATCH_SIZE=50
EVENT_BATCH_TIMEOUT=5000
EVENT_ARCHIVE_THRESHOLD=90

# Security
JWT_SECRET=your-secure-secret
API_KEY=your-secure-api-key
```

### Kubernetes Configuration

Example Kubernetes deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: event-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: event-service
  template:
    metadata:
      labels:
        app: event-service
    spec:
      containers:
      - name: event-service
        image: your-registry/event-service:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: event-service-secrets
        resources:
          requests:
            cpu: "100m"
            memory: "256Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
```

## Monitoring and Logging

### Prometheus Configuration

Example Prometheus configuration:

```yaml
scrape_configs:
  - job_name: 'event-service'
    static_configs:
      - targets: ['event-service:3000']
```

### Grafana Dashboards

Import the following dashboards:
1. Event Processing Metrics
2. System Resource Utilization
3. Database Performance
4. Cache Performance

## Scaling

### Horizontal Scaling

To scale the service horizontally:

```bash
# Using Docker Compose
docker-compose up -d --scale event-service=3

# Using Kubernetes
kubectl scale deployment event-service --replicas=3
```

### Vertical Scaling

Adjust resource limits in the deployment configuration:

```yaml
resources:
  requests:
    cpu: "200m"
    memory: "512Mi"
  limits:
    cpu: "1000m"
    memory: "1Gi"
```

## Backup and Recovery

### Database Backup

1. Schedule regular backups:
```bash
pg_dump -U postgres -d api > backup.sql
```

2. Restore from backup:
```bash
psql -U postgres -d api < backup.sql
```

### Event Archive Backup

1. Export archived events:
```bash
npm run export-events -- --output=events-backup.json
```

2. Import archived events:
```bash
npm run import-events -- --input=events-backup.json
```

## Maintenance

### Regular Tasks

1. Cache cleanup:
```bash
npm run cache:cleanup
```

2. Database maintenance:
```bash
npm run db:maintenance
```

3. Event archive rotation:
```bash
npm run events:rotate
```

### Monitoring Tasks

1. Check service health:
```bash
curl http://localhost:3000/health
```

2. View performance metrics:
```bash
curl http://localhost:3000/metrics
```

## Troubleshooting

### Common Issues

1. Database Connection Issues
   - Check database credentials
   - Verify network connectivity
   - Check database logs

2. RabbitMQ Connection Issues
   - Verify RabbitMQ is running
   - Check connection credentials
   - Monitor queue health

3. Performance Issues
   - Check resource utilization
   - Monitor cache hit rates
   - Review event processing rates

### Logs

View service logs:
```bash
# Docker
docker-compose logs -f event-service

# Kubernetes
kubectl logs -f deployment/event-service
```

## Security Considerations

1. Use secure passwords and secrets
2. Enable TLS for all services
3. Implement proper access controls
4. Regular security audits
5. Monitor for suspicious activity

## Updates and Upgrades

1. Backup all data
2. Test in staging environment
3. Deploy updates during low-traffic periods
4. Monitor for issues
5. Rollback plan in place 