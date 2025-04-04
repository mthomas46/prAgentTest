# Operations Guide

## Table of Contents
1. [Deployment](#deployment)
2. [CI/CD Pipeline](#cicd-pipeline)
3. [DevOps Tooling](#devops-tooling)
4. [Monitoring](#monitoring)
5. [Maintenance](#maintenance)

## Deployment

### Environment Configuration

#### Production Environment
```yaml
environment: production
services:
  balder:
    replicas: 3
    resources:
      cpu: 2
      memory: 4Gi
  bifrost:
    replicas: 2
    resources:
      cpu: 2
      memory: 4Gi
  brokkr:
    replicas: 2
    resources:
      cpu: 1
      memory: 2Gi
  loki:
    replicas: 2
    resources:
      cpu: 2
      memory: 8Gi
```

#### Staging Environment
```yaml
environment: staging
services:
  balder:
    replicas: 2
    resources:
      cpu: 1
      memory: 2Gi
  bifrost:
    replicas: 1
    resources:
      cpu: 1
      memory: 2Gi
  brokkr:
    replicas: 1
    resources:
      cpu: 1
      memory: 2Gi
  loki:
    replicas: 1
    resources:
      cpu: 1
      memory: 4Gi
```

### Deployment Process

1. **Pre-deployment Checks**
   - Verify environment variables
   - Check resource availability
   - Validate configurations
   - Review security settings

2. **Deployment Steps**
   ```bash
   # Build and push images
   docker-compose build
   docker-compose push

   # Deploy to Kubernetes
   kubectl apply -f k8s/
   
   # Verify deployment
   kubectl get pods
   kubectl get services
   ```

3. **Post-deployment Verification**
   - Check service health
   - Verify logs
   - Monitor metrics
   - Test functionality

### Rollback Procedure

1. **Identify Issues**
   - Check monitoring alerts
   - Review error logs
   - Analyze metrics

2. **Execute Rollback**
   ```bash
   # Rollback to previous version
   kubectl rollout undo deployment/<service-name>
   
   # Verify rollback
   kubectl rollout status deployment/<service-name>
   ```

## CI/CD Pipeline

### Pipeline Stages

1. **Build**
   - Code compilation
   - Dependency installation
   - Artifact creation

2. **Test**
   - Unit tests
   - Integration tests
   - Security scans
   - Code quality checks

3. **Deploy**
   - Environment preparation
   - Service deployment
   - Configuration updates
   - Health checks

### Configuration

```yaml
pipeline:
  triggers:
    - push
    - pull_request
  stages:
    - build
    - test
    - deploy
  environments:
    - development
    - staging
    - production
```

### Automated Testing

1. **Unit Tests**
   ```bash
   npm run test
   ```

2. **Integration Tests**
   ```bash
   npm run test:integration
   ```

3. **Security Scans**
   ```bash
   npm run security:scan
   ```

## DevOps Tooling

### Infrastructure as Code

#### Terraform Configuration
```hcl
provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "balder" {
  metadata {
    name = "balder"
  }
  spec {
    replicas = 3
    template {
      spec {
        container {
          name  = "balder"
          image = "balder:latest"
        }
      }
    }
  }
}
```

#### Ansible Playbooks
```yaml
- name: Deploy Yggdrasil Services
  hosts: all
  tasks:
    - name: Install dependencies
      apt:
        name: "{{ item }}"
        state: present
      with_items:
        - docker
        - docker-compose
```

### Monitoring Tools

1. **Prometheus Configuration**
   ```yaml
   global:
     scrape_interval: 15s
   
   scrape_configs:
     - job_name: 'balder'
       static_configs:
         - targets: ['balder:3000']
   ```

2. **Grafana Dashboards**
   - Service health
   - Performance metrics
   - Error rates
   - Resource utilization

### Logging Stack

1. **ELK Configuration**
   ```yaml
   elasticsearch:
     image: elasticsearch:7.9.0
     ports:
       - "9200:9200"
   
   logstash:
     image: logstash:7.9.0
     ports:
       - "5000:5000"
   
   kibana:
     image: kibana:7.9.0
     ports:
       - "5601:5601"
   ```

## Monitoring

### Metrics Collection

1. **Service Metrics**
   - Response time
   - Error rates
   - Request volume
   - Resource usage

2. **System Metrics**
   - CPU utilization
   - Memory usage
   - Disk I/O
   - Network traffic

### Alerting

1. **Alert Rules**
   ```yaml
   groups:
     - name: service_alerts
       rules:
         - alert: HighErrorRate
           expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
   ```

2. **Notification Channels**
   - Email
   - Slack
   - PagerDuty
   - Webhooks

## Maintenance

### Regular Tasks

1. **Database Maintenance**
   - Backup procedures
   - Index optimization
   - Vacuum operations
   - Data archiving

2. **System Updates**
   - Security patches
   - Dependency updates
   - Configuration updates
   - Certificate renewal

### Disaster Recovery

1. **Backup Procedures**
   ```bash
   # Database backup
   pg_dump -U postgres yggdrasil > backup.sql
   
   # Configuration backup
   tar -czf config_backup.tar.gz /etc/yggdrasil/
   ```

2. **Recovery Procedures**
   ```bash
   # Database restore
   psql -U postgres yggdrasil < backup.sql
   
   # Configuration restore
   tar -xzf config_backup.tar.gz -C /
   ```

### Performance Optimization

1. **Resource Tuning**
   - Memory allocation
   - CPU limits
   - Network configuration
   - Storage optimization

2. **Service Optimization**
   - Cache configuration
   - Load balancing
   - Connection pooling
   - Query optimization 