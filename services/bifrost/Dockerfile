# Stage 1: Dependencies with caching
FROM node:18-alpine as dependencies
WORKDIR /app

# Only copy package files for better layer caching
COPY package*.json ./

# Install dependencies with production flag to skip dev dependencies
# Add all required dependencies in one step to avoid multiple npm installs
RUN npm ci --only=production --legacy-peer-deps && \
    npm install pg class-transformer class-validator --save

# Stage 2: Builder
FROM node:18-alpine as builder
WORKDIR /app

# Copy source code
COPY . .

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Build the application
RUN npm run build

# Stage 3: Production (minimal image)
FROM node:18-alpine as production
WORKDIR /app

# Copy only what's needed to run the application
COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./

# Install only the minimal required packages and set permissions
RUN apk add --no-cache curl && \
    chown -R node:node /app

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Use non-root user
USER node

# Start the application
CMD ["node", "dist/main.js"]