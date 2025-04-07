#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting all services..."

# Stop any running containers and clean up
echo "Stopping any running containers..."
docker-compose down -v
docker-compose -f docker-compose.monitoring.yml down -v
docker-compose -f docker-compose.core.yml down -v

# Start core services
echo "Starting core services..."
docker-compose -f docker-compose.core.yml up -d

# Start main services
echo "Starting main services..."
docker-compose up -d

# Start monitoring services
echo "Starting monitoring services..."
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

# Check core services
check_service "PostgreSQL" 5433 "/" || exit 1

# Check main services
check_service "Task Service" 3000 "/health" || exit 1
check_service "Valkyrie" 3005 "/health" || exit 1
check_service "Sigrun" 3006 "/health" || exit 1
check_service "Draupnir External" 3003 "/health" || exit 1
check_service "Draupnir Internal" 3004 "/health" || exit 1
check_service "Balder" 3002 "/health" || exit 1

# Check monitoring services
check_service "Loki" 3100 "/ready" || exit 1
check_service "Prometheus" 9090 "/-/healthy" || exit 1
check_service "Grafana" 3001 "/api/health" || exit 1
check_service "Node Exporter" 9100 "/metrics" || exit 1

echo -e "${GREEN}All services are up and healthy!${NC}"
echo "You can access the services at:"
echo "- Task Service: http://localhost:3000"
echo "- Valkyrie: http://localhost:3005"
echo "- Sigrun: http://localhost:3006"
echo "- Draupnir External: http://localhost:3003"
echo "- Draupnir Internal: http://localhost:3004"
echo "- Balder: http://localhost:3002"
echo "- PostgreSQL: localhost:5433"
echo "- Loki: http://localhost:3100"
echo "- Prometheus: http://localhost:9090"
echo "- Grafana: http://localhost:3001"
echo "- Node Exporter: http://localhost:9100" 