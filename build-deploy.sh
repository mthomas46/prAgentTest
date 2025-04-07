#!/bin/bash

# Optimized build and deploy script for microservices
# This script provides options for building and deploying services with optimized performance

set -e

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Optimized Build & Deploy Script${NC}"
echo -e "${BLUE}=================================${NC}"

# Start time tracking
START_TIME=$(date +%s)

# Function to display help
show_help() {
  echo "Usage: $0 [OPTIONS] [SERVICES...]"
  echo
  echo "Options:"
  echo "  -h, --help                 Show this help message"
  echo "  -b, --build                Build services only"
  echo "  -d, --deploy               Deploy services only (uses existing images)"
  echo "  -a, --all                  Build and deploy all services"
  echo "  -p, --parallel             Build services in parallel"
  echo "  -c, --clean                Clean Docker cache before building"
  echo "  -t, --target TARGET        Specify Docker build target (development/production)"
  echo "  --no-cache                 Build without using Docker cache"
  echo
  echo "Examples:"
  echo "  $0 -b -p task-service bifrost    # Build task-service and bifrost in parallel"
  echo "  $0 -a -c                         # Clean, build and deploy all services"
  echo "  $0 -d                            # Deploy using existing images"
  echo "  $0 -b -t production              # Build for production"
}

# Default options
BUILD=false
DEPLOY=false
ALL=false
PARALLEL=false
CLEAN=false
NO_CACHE=""
TARGET="development"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      show_help
      exit 0
      ;;
    -b|--build)
      BUILD=true
      shift
      ;;
    -d|--deploy)
      DEPLOY=true
      shift
      ;;
    -a|--all)
      ALL=true
      shift
      ;;
    -p|--parallel)
      PARALLEL=true
      shift
      ;;
    -c|--clean)
      CLEAN=true
      shift
      ;;
    -t|--target)
      TARGET="$2"
      shift 2
      ;;
    --no-cache)
      NO_CACHE="--no-cache"
      shift
      ;;
    -*)
      echo -e "${RED}Unknown option: $1${NC}"
      show_help
      exit 1
      ;;
    *)
      SERVICES+=("$1")
      shift
      ;;
  esac
done

# If neither build nor deploy is specified, do both
if [ "$BUILD" = false ] && [ "$DEPLOY" = false ]; then
  BUILD=true
  DEPLOY=true
fi

# Clean Docker system if requested
if [ "$CLEAN" = true ]; then
  echo -e "${YELLOW}Cleaning Docker system...${NC}"
  docker system prune -f
  echo -e "${GREEN}Docker system cleaned${NC}"
fi

# Build services
if [ "$BUILD" = true ]; then
  if [ "$ALL" = true ]; then
    if [ "$PARALLEL" = true ]; then
      echo -e "${YELLOW}Building all services in parallel...${NC}"
      ./build-parallel.sh --all
    else
      echo -e "${YELLOW}Building all services...${NC}"
      docker-compose -f docker-compose.yml -f docker-compose.build.yml build $NO_CACHE --build-arg TARGET=$TARGET
    fi
  elif [ ${#SERVICES[@]} -gt 0 ]; then
    if [ "$PARALLEL" = true ]; then
      echo -e "${YELLOW}Building specified services in parallel...${NC}"
      ./build-parallel.sh "${SERVICES[@]}"
    else
      echo -e "${YELLOW}Building specified services...${NC}"
      docker-compose -f docker-compose.yml -f docker-compose.build.yml build $NO_CACHE --build-arg TARGET=$TARGET "${SERVICES[@]}"
    fi
  else
    echo -e "${RED}No services specified for building. Use -a/--all or specify service names.${NC}"
    exit 1
  fi
fi

# Deploy services
if [ "$DEPLOY" = true ]; then
  if [ "$ALL" = true ]; then
    echo -e "${YELLOW}Deploying all services...${NC}"
    docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d
  elif [ ${#SERVICES[@]} -gt 0 ]; then
    echo -e "${YELLOW}Deploying specified services...${NC}"
    docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d "${SERVICES[@]}"
  else
    echo -e "${RED}No services specified for deployment. Use -a/--all or specify service names.${NC}"
    exit 1
  fi
fi

# Calculate and display total time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}Process completed in ${MINUTES}m ${SECONDS}s${NC}"
echo -e "${BLUE}=================================${NC}"
