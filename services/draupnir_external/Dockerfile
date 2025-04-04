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

# Copy source files
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R node:node logs

# Switch to non-root user
USER node

# Expose port
EXPOSE 3003

# Start the service in dev mode
CMD ["npm", "run", "dev"] 