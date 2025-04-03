#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to test an endpoint
test_endpoint() {
    local service=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=$4

    echo -e "\nTesting ${service} - ${method} ${endpoint}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "http://localhost:3002$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "http://localhost:3002$endpoint" -H "Content-Type: application/json" -d "$data")
    fi

    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success (HTTP $status_code)${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}✗ Failed (HTTP $status_code)${NC}"
        echo "Response: $body"
    fi
}

echo "Testing API Gateway Endpoints..."

# Task Service Endpoints
echo -e "\n=== Task Service ==="
test_endpoint "Task" "/tasks" "POST" '{"title":"Test Task","description":"Testing task creation","priority":"medium"}'
test_endpoint "Task" "/tasks"
test_endpoint "Task" "/tasks/health"

# Document Service Endpoints
echo -e "\n=== Document Service ==="
test_endpoint "Document" "/documents" "POST" '{"name":"Test Document","content":"Test content"}'
test_endpoint "Document" "/documents"
test_endpoint "Document" "/documents/health"

# Webhook Service Endpoints
echo -e "\n=== Webhook Service ==="
test_endpoint "Webhook" "/webhooks" "POST" '{"url":"http://example.com/webhook","eventType":"task.created"}'
test_endpoint "Webhook" "/webhooks"
test_endpoint "Webhook" "/webhooks/health"

# Monitoring Service Endpoints
echo -e "\n=== Monitoring Service ==="
test_endpoint "Monitoring" "/monitoring/metrics"
test_endpoint "Monitoring" "/monitoring/health"
test_endpoint "Monitoring" "/monitoring/alerts"

# Service Discovery Endpoints
echo -e "\n=== Service Discovery ==="
test_endpoint "ServiceDiscovery" "/service-discovery/services"
test_endpoint "ServiceDiscovery" "/service-discovery/health" 