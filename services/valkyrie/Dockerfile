# Use Node.js 18 Alpine as the base image
FROM node:18.19-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory and set permissions
RUN mkdir -p /app/logs && \
    chown -R node:node /app/logs

# Switch to non-root user
USER node

# Expose port
EXPOSE 3005

# Start the application
CMD ["npm", "run", "dev"] 