# Use Node.js 18.19 Alpine as base image
FROM node:18.19-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first
COPY package*.json ./

# Skip version check in Docker build as it tries to access services directory

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory and set permissions
RUN mkdir -p logs && chown -R node:node logs

# Switch to non-root user for security
USER node

# Expose the port
EXPOSE 3000

# Start the application in dev mode
CMD ["npm", "run", "dev"] 