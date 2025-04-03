# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production --legacy-peer-deps

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Install curl for health checks
RUN apk add --no-cache curl

# Expose the port
EXPOSE 3003

# Start the application
CMD ["node", "dist/main.js"] 