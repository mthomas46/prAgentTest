# Use Node.js 18.19 Alpine as base image
FROM node:18.19-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files and version check script first
COPY package*.json ./
COPY scripts/check-node-version.js ./scripts/

# Run version check
RUN node scripts/check-node-version.js

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