#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to test an endpoint
test_endpoint() {
    local service=$1
    local port=$2
    local endpoint=$3
    local method=${4:-GET}
    local data=$5

    echo -e "\nTesting ${service} - ${method} ${endpoint}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "http://localhost:${port}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "http://localhost:${port}${endpoint}" -H "Content-Type: application/json" -d "$data")
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

echo "Testing Service Endpoints..."

# Task Service Endpoints
echo -e "\n=== Task Service ==="
test_endpoint "Task Service" "3000" "/tasks" "POST" '{"title":"Test Task","description":"Testing task creation","priority":"medium"}'
test_endpoint "Task Service" "3000" "/tasks"
test_endpoint "Task Service" "3000" "/health"

# API Gateway Endpoints
echo -e "\n=== API Gateway ==="
test_endpoint "API Gateway" "3001" "/health"

# UI Service Endpoints
echo -e "\n=== UI Service ==="
test_endpoint "UI Service" "3002" "/health"

# Avetta Doc Agent Endpoints
echo -e "\n=== Avetta Doc Agent ==="
test_endpoint "Avetta Doc Agent" "3004" "/health"

# Monitoring Endpoints
echo -e "\n=== Monitoring Services ==="
test_endpoint "Prometheus" "9090" "/-/healthy"
test_endpoint "Grafana" "3003" "/api/health"
test_endpoint "Elasticsearch" "9200" "/_cluster/health"
test_endpoint "Kibana" "5601" "/api/status"
test_endpoint "Logstash" "9600" "/_node/stats"

# Ngrok Endpoints
echo -e "\n=== Ngrok ==="
test_endpoint "Ngrok" "4040" "/api/tunnels" 