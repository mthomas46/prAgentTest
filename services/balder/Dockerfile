# Stage 1: Dependencies
FROM node:18-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:18-alpine as builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache curl

# Install Elm
RUN curl -L -o elm.gz https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz
RUN gunzip elm.gz
RUN chmod +x elm
RUN mv elm /usr/local/bin/

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Create dist directory
RUN mkdir -p dist/public

# Build TypeScript and Elm
RUN npm run build

# Copy static files
RUN cp -r public/* dist/public/

# Stage 3: Production
FROM node:18-alpine as production
WORKDIR /usr/src/app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/swagger.yaml ./swagger.yaml
COPY --from=builder /app/package*.json ./

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose the port
EXPOSE 3002

# Start the application
CMD ["npm", "start"] 