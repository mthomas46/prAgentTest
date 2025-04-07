# Stage 1: Dependencies with caching
FROM node:18.19-alpine AS dependencies
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files for better layer caching
COPY package*.json ./

# Use npm ci for faster, more reliable dependency installation
RUN npm ci --only=production

# Stage 2: Development dependencies (for dev tools)
FROM dependencies AS dev-dependencies
WORKDIR /app

# Install dev dependencies
RUN npm ci

# Stage 3: Build
FROM dev-dependencies AS builder
WORKDIR /app

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Stage 4: Production
FROM node:18.19-alpine AS production
WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache python3

# Copy built application and production dependencies
COPY --from=builder /app/src ./src/
COPY --from=dependencies /app/node_modules ./node_modules/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/logs ./logs/

# Set permissions
RUN chown -R node:node .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user for security
USER node

# Expose the port
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]

# Stage 5: Development (default target)
FROM dev-dependencies AS development
WORKDIR /app

# Copy source code
COPY . .

# Create logs directory and set permissions
RUN mkdir -p logs && chown -R node:node .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Switch to non-root user for security
USER node

# Expose the port
EXPOSE 3000

# Start the application in dev mode
CMD ["npm", "run", "dev"]