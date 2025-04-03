# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application and list contents
RUN npm run build && \
    echo "Builder stage dist contents:" && \
    ls -la dist/ && \
    echo "Builder stage dist/src contents:" && \
    ls -la dist/src/

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# List contents of dist directory in production stage
RUN echo "Production stage dist contents:" && \
    ls -la dist/ && \
    echo "Production stage dist/src contents:" && \
    ls -la dist/src/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Start the application
CMD ["node", "dist/src/main.js"] 