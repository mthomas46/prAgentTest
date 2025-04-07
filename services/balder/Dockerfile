# Stage 1: Dependencies with caching
FROM node:18-alpine as dependencies
WORKDIR /app

# Only copy package files for better layer caching
COPY package*.json ./

# Use npm ci for faster, more reliable dependency installation
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:18-alpine as builder
WORKDIR /app

# Copy source code
COPY . .

# Copy dependencies from the dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Install build dependencies, create directories, build and copy files in a single layer
RUN apk add --no-cache curl && \
    mkdir -p dist/public && \
    npm run build && \
    cp -r public/* dist/public/ || true

# Stage 3: Production (minimal image)
FROM node:18-alpine as production
WORKDIR /usr/src/app

# Copy only what's needed to run the application
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/swagger.yaml ./

# Copy public directory if it exists (using separate RUN to handle conditional)
RUN mkdir -p ./public/

# Copy node_modules
COPY --from=dependencies /app/node_modules/ ./node_modules/

# Copy public files if they exist
RUN if [ -d "/app/dist/public/" ]; then cp -r /app/dist/public/* ./public/ || true; fi

# Install curl for healthcheck and set permissions in a single layer
RUN apk add --no-cache curl && \
    chown -R node:node .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose the port
EXPOSE 3002

# Use non-root user
USER node

# Start the application
CMD ["npm", "start"]