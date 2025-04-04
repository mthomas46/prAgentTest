#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting all services..."

# Start main services
docker-compose up -d

# Start monitoring services
docker-compose -f docker-compose.monitoring.yml up -d

# Function to check service health
check_service() {
    local service=$1
    local port=$2
    local endpoint=$3
    local max_attempts=30
    local attempt=1

    echo "Checking $service on port $port..."
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "http://localhost:$port$endpoint" > /dev/null; then
            echo -e "${GREEN}$service is healthy!${NC}"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: $service is not ready yet..."
        sleep 5
        attempt=$((attempt + 1))
    done

    echo -e "${RED}$service failed to become healthy after $max_attempts attempts${NC}"
    return 1
}

# Wait for services to be healthy
echo "Waiting for services to be healthy..."

# Check main services
check_service "Task Service" 3000 "/health" || exit 1
check_service "UI Service" 3002 "/health" || exit 1
check_service "Heimdal" 3006 "/health" || exit 1
check_service "Loki" 3007 "/api/loki/status/heimdal" || exit 1

# Check monitoring services
check_service "Prometheus" 9090 "/-/healthy" || exit 1
check_service "Grafana" 3003 "/api/health" || exit 1
check_service "Elasticsearch" 9200 "" || exit 1
check_service "Kibana" 5601 "/api/status" || exit 1

echo -e "${GREEN}All services are up and healthy!${NC}"
echo "You can access the services at:"
echo "- Task Service: http://localhost:3000"
echo "- UI Service: http://localhost:3002"
echo "- Heimdal: http://localhost:3006"
echo "- Loki: http://localhost:3007"
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3003"
echo "- Kibana: http://localhost:5601" 