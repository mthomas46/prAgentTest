FROM node:18.19-alpine

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
RUN npm install -g ts-node-dev

# Copy source files
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R node:node logs

# Switch to non-root user
USER node

# Expose port
EXPOSE 3004

# Start the service in dev mode
CMD ["ts-node-dev", "--respawn", "src/index.ts"] 