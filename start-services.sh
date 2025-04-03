#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting all services...${NC}"

# Create the monitoring network if it doesn't exist
if ! docker network ls | grep -q "monitoring"; then
    echo -e "${GREEN}Creating monitoring network...${NC}"
    docker network create monitoring
fi

# Stop any existing containers and remove orphans
echo -e "${GREEN}Cleaning up existing containers...${NC}"
docker-compose down --remove-orphans
docker-compose -f docker-compose.ngrok.yml down --remove-orphans
docker-compose -f docker-compose.monitoring.yml down --remove-orphans

# Start main services
echo -e "${GREEN}Starting main services...${NC}"
docker-compose up --build --detach

# Start monitoring services
echo -e "${GREEN}Starting monitoring services...${NC}"
docker-compose -f docker-compose.monitoring.yml up --build --detach

# Start ngrok services
echo -e "${GREEN}Starting ngrok services...${NC}"
docker-compose -f docker-compose.ngrok.yml up --build --detach

# Wait for services to be ready
echo -e "${GREEN}Waiting for services to be ready...${NC}"
sleep 10

# Test service health
echo -e "${GREEN}Testing service health endpoints...${NC}"

# Array of services to check
declare -A services=(
    ["Task Service"]="http://localhost:3000/health"
    ["UI Service"]="http://localhost:3002/health"
    ["API Gateway"]="http://localhost:3001/health"
    ["Grafana"]="http://localhost:3003/api/health"
    ["Prometheus"]="http://localhost:9090/-/healthy"
    ["Avetta Doc Agent"]="http://localhost:3004/health"
    ["Elasticsearch"]="http://localhost:9200/_cluster/health"
    ["Kibana"]="http://localhost:5601/api/status"
    ["Logstash"]="http://localhost:9600/_node/stats"
)

# Check each service
for service in "${!services[@]}"; do
    url=${services[$service]}
    response=$(curl -s -o /dev/null -w "%{http_code}" $url)
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓ $service is healthy${NC}"
    else
        echo -e "${RED}✗ $service is not responding (status: $response)${NC}"
    fi
done

# Get ngrok public URLs
echo -e "\n${GREEN}Ngrok Public URLs:${NC}"
sleep 5 # Wait for ngrok to establish tunnels
curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | "\(.name): \(.public_url)"'

echo -e "\n${GREEN}All services have been started!${NC}"
echo -e "You can monitor ngrok at: http://localhost:4040"
echo -e "You can access Grafana at: http://localhost:3003 (admin/admin)"
echo -e "You can access Kibana at: http://localhost:5601" 