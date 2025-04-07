#!/bin/bash

# Optimized parallel build script for microservices
# This script builds Docker images in parallel to reduce overall build time

set -e

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Parallel Docker Build Script${NC}"
echo -e "${BLUE}=================================${NC}"

# Start time tracking
START_TIME=$(date +%s)

# Create a temporary directory for build logs
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# Function to build a single service
build_service() {
  local service=$1
  local log_file="$TEMP_DIR/${service}.log"
  
  echo -e "${YELLOW}Starting build for ${service}...${NC}"
  
  # Build the service with build-arg to skip tests
  if docker-compose build --build-arg SKIP_TESTS=true --no-cache "$service" > "$log_file" 2>&1; then
    echo -e "${GREEN}✓ Successfully built ${service}${NC}"
  else
    echo -e "\033[0;31m✗ Failed to build ${service}. Check logs at ${log_file}\033[0m"
    cat "$log_file"
    return 1
  fi
}

# Function to build services in parallel
build_parallel() {
  local pids=()
  local services=("$@")
  
  for service in "${services[@]}"; do
    build_service "$service" &
    pids+=($!)
  done
  
  # Wait for all builds to complete
  for pid in "${pids[@]}"; do
    wait "$pid"
  done
}

# Parse command line arguments
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  echo "Usage: $0 [--all] [service1 service2 ...]"
  echo "  --all: Build all services in parallel"
  echo "  service1 service2 ...: Build specific services in parallel"
  exit 0
fi

if [ "$1" == "--all" ]; then
  echo -e "${BLUE}Building all services in parallel...${NC}"
  
  # Get all services from docker-compose
  SERVICES=$(docker-compose config --services)
  
  # Convert to array
  readarray -t SERVICE_ARRAY <<< "$SERVICES"
  
  # Build all services in parallel
  build_parallel "${SERVICE_ARRAY[@]}"
else
  if [ $# -eq 0 ]; then
    echo "No services specified. Use --all to build all services or specify service names."
    exit 1
  fi
  
  # Build specified services in parallel
  build_parallel "$@"
fi

# Calculate and display total build time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Build completed in ${MINUTES}m ${SECONDS}s${NC}"
echo -e "${BLUE}=================================${NC}"
