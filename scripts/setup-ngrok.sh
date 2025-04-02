#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up ngrok configuration...${NC}"

# Create ngrok directory if it doesn't exist
mkdir -p ngrok

# Copy environment template if .env doesn't exist
if [ ! -f "ngrok/.env" ]; then
    cp ngrok/.env.example ngrok/.env
    echo -e "${YELLOW}Created ngrok/.env from template. Please update it with your ngrok authentication token.${NC}"
fi

# Check if ngrok.yml exists
if [ ! -f "ngrok/ngrok.yml" ]; then
    echo -e "${YELLOW}Creating ngrok.yml configuration...${NC}"
    cat > ngrok/ngrok.yml << 'EOL'
version: "2"
tunnels:
  api:
    proto: http
    addr: api:3000
    inspect: true
    labels:
      service: api
  avetta-doc-agent:
    proto: http
    addr: avetta-doc-agent:3000
    inspect: true
    labels:
      service: avetta-doc-agent
  prometheus:
    proto: http
    addr: prometheus:9090
    inspect: true
    labels:
      service: prometheus
  grafana:
    proto: http
    addr: grafana:3000
    inspect: true
    labels:
      service: grafana
  kibana:
    proto: http
    addr: kibana:5601
    inspect: true
    labels:
      service: kibana
  elasticsearch:
    proto: http
    addr: elasticsearch:9200
    inspect: true
    labels:
      service: elasticsearch
  logstash:
    proto: http
    addr: logstash:9600
    inspect: true
    labels:
      service: logstash
EOL
    echo -e "${GREEN}Created ngrok.yml configuration file.${NC}"
fi

# Check if docker-compose.ngrok.yml exists
if [ ! -f "docker-compose.ngrok.yml" ]; then
    echo -e "${YELLOW}Creating docker-compose.ngrok.yml...${NC}"
    cat > docker-compose.ngrok.yml << 'EOL'
version: '3.8'

services:
  ngrok:
    image: ngrok/ngrok:latest
    ports:
      - "4040:4040"
    environment:
      - NGROK_AUTH=${NGROK_AUTH_TOKEN}
      - NGROK_CONFIG=/etc/ngrok/ngrok.yml
    volumes:
      - ./ngrok/ngrok.yml:/etc/ngrok/ngrok.yml
    command: start --config /etc/ngrok/ngrok.yml
    networks:
      - monitoring

networks:
  monitoring:
    external: true
EOL
    echo -e "${GREEN}Created docker-compose.ngrok.yml file.${NC}"
fi

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update ngrok/.env with your authentication token"
echo "2. Start the ngrok service: docker-compose -f docker-compose.ngrok.yml up -d"
echo "3. Access the ngrok web interface at http://localhost:4040" 