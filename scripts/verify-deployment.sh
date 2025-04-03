#!/bin/bash

# Configuration
MAX_RETRIES=30
RETRY_INTERVAL=10
API_URL="https://api.example.com"

# Verify API endpoints
verify_api() {
  local endpoint=$1
  local expected_status=$2
  
  echo "Verifying endpoint: $endpoint"
  response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
  
  if [ "$response" = "$expected_status" ]; then
    echo "✓ Endpoint $endpoint returned $response as expected"
    return 0
  else
    echo "✗ Endpoint $endpoint returned $response, expected $expected_status"
    return 1
  fi
}

# Verify database migrations
verify_migrations() {
  echo "Verifying database migrations..."
  if npm run typeorm migration:show | grep -q "down migrations"; then
    echo "✗ Found pending migrations"
    return 1
  fi
  echo "✓ All migrations are up to date"
  return 0
}

# Verify monitoring stack
verify_monitoring() {
  echo "Verifying monitoring stack..."
  
  # Check Prometheus
  if ! curl -s "http://localhost:9090/-/ready" | grep -q "Prometheus Server is Ready"; then
    echo "✗ Prometheus is not ready"
    return 1
  fi
  
  # Check Grafana
  if ! curl -s "http://localhost:3001/api/health" | grep -q "ok"; then
    echo "✗ Grafana is not ready"
    return 1
  fi
  
  # Check Elasticsearch
  if ! curl -s "http://localhost:9200/_cluster/health" | grep -q '"status":"green\|yellow"'; then
    echo "✗ Elasticsearch is not ready"
    return 1
  fi
  
  echo "✓ Monitoring stack is healthy"
  return 0
}

# Verify Docker containers
verify_containers() {
  echo "Verifying Docker containers..."
  
  required_containers=("api-gateway" "postgres" "elasticsearch" "prometheus" "grafana")
  
  for container in "${required_containers[@]}"; do
    if ! docker ps | grep -q "$container"; then
      echo "✗ Container $container is not running"
      return 1
    fi
  done
  
  echo "✓ All required containers are running"
  return 0
}

# Main verification loop
main() {
  echo "Starting deployment verification..."
  
  retries=0
  while [ $retries -lt $MAX_RETRIES ]; do
    failed=0
    
    # Verify core API endpoints
    verify_api "/health" 200 || failed=1
    verify_api "/metrics" 200 || failed=1
    verify_api "/docs" 200 || failed=1
    
    # Verify other components
    verify_migrations || failed=1
    verify_monitoring || failed=1
    verify_containers || failed=1
    
    if [ $failed -eq 0 ]; then
      echo "✓ All verifications passed"
      exit 0
    fi
    
    retries=$((retries + 1))
    if [ $retries -lt $MAX_RETRIES ]; then
      echo "Retrying in $RETRY_INTERVAL seconds... (attempt $retries/$MAX_RETRIES)"
      sleep $RETRY_INTERVAL
    fi
  done
  
  echo "✗ Deployment verification failed after $MAX_RETRIES attempts"
  exit 1
}

main 