#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to test a service connection
test_service() {
    local service_name=$1
    local service_url=$2
    local health_endpoint=$3

    echo -e "Testing connection to ${service_name}..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "${service_url}${health_endpoint}")

    if [ "$response" -eq 200 ]; then
        echo -e "${GREEN}✓ ${service_name} is accessible${NC}"
        return 0
    else
        echo -e "${RED}✗ ${service_name} is not accessible (Status: ${response})${NC}"
        return 1
    fi
}

# Test Task Service
test_service "Task Service" "http://task-service:3000" "/health"

# Test UI Service
test_service "UI Service" "http://ui-service:4000" "/health"

# Test Heimdal Service
test_service "Heimdal Service" "http://heimdal:3006" "/health"

# Test Loki Service
test_service "Loki Service" "http://loki:3000" "/api/loki/status/heimdal"

# Test Bifrost Gateway
test_service "Bifrost Gateway" "http://localhost:3000" "/gateway/health"

# Test RabbitMQ
echo -e "Testing RabbitMQ connection..."
if curl -s -u guest:guest http://rabbitmq:15672/api/overview > /dev/null; then
    echo -e "${GREEN}✓ RabbitMQ is accessible${NC}"
else
    echo -e "${RED}✗ RabbitMQ is not accessible${NC}"
fi

# Test PostgreSQL
echo -e "Testing PostgreSQL connection..."
if pg_isready -h postgres -p 5432 -U postgres > /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is accessible${NC}"
else
    echo -e "${RED}✗ PostgreSQL is not accessible${NC}"
fi

echo -e "\nConnection testing complete!" 