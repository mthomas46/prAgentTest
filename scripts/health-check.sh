#!/bin/bash

# Check API Gateway health
check_api() {
  echo "Checking API Gateway health..."
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
  if [ "$response" != "200" ]; then
    echo "API Gateway health check failed with status $response"
    return 1
  fi
  echo "API Gateway is healthy"
  return 0
}

# Check Elasticsearch health
check_elasticsearch() {
  echo "Checking Elasticsearch health..."
  response=$(curl -s http://localhost:9200/_cluster/health | jq -r '.status')
  if [ "$response" != "green" ] && [ "$response" != "yellow" ]; then
    echo "Elasticsearch health check failed with status $response"
    return 1
  fi
  echo "Elasticsearch is healthy"
  return 0
}

# Check Prometheus health
check_prometheus() {
  echo "Checking Prometheus health..."
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/-/healthy)
  if [ "$response" != "200" ]; then
    echo "Prometheus health check failed with status $response"
    return 1
  fi
  echo "Prometheus is healthy"
  return 0
}

# Check Grafana health
check_grafana() {
  echo "Checking Grafana health..."
  response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)
  if [ "$response" != "200" ]; then
    echo "Grafana health check failed with status $response"
    return 1
  fi
  echo "Grafana is healthy"
  return 0
}

# Check PostgreSQL health
check_postgres() {
  echo "Checking PostgreSQL health..."
  if ! pg_isready -h localhost -p 5432 -U postgres; then
    echo "PostgreSQL health check failed"
    return 1
  fi
  echo "PostgreSQL is healthy"
  return 0
}

# Run all checks
main() {
  echo "Starting health checks..."
  
  failed=0
  check_api || failed=1
  check_elasticsearch || failed=1
  check_prometheus || failed=1
  check_grafana || failed=1
  check_postgres || failed=1
  
  if [ $failed -eq 1 ]; then
    echo "One or more health checks failed"
    exit 1
  fi
  
  echo "All health checks passed"
  exit 0
}

main 