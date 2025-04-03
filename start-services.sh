#!/bin/bash

# Function to start a service
start_service() {
    local service_name=$1
    local port=$2
    
    echo "Starting $service_name on port $port..."
    cd services/$service_name
    npm install
    PORT=$port npm run start:dev &
    cd ../..
    sleep 5  # Wait for service to start
}

# Start each service on a different port
start_service "api-gateway" 3002
start_service "task-service" 3003
start_service "document-service" 3004
start_service "webhook-service" 3005
start_service "monitoring-service" 3006
start_service "service-discovery" 3007

echo "All services started. Waiting for them to be ready..."
sleep 10

# Test if services are up
echo "Testing service health endpoints..."
for port in 3002 3003 3004 3005 3006 3007; do
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/health)
    if [ "$response" = "200" ]; then
        echo "Service on port $port is healthy"
    else
        echo "Service on port $port is not responding"
    fi
done 