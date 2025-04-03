# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
COPY shared/package*.json ./shared/
RUN npm install --legacy-peer-deps
RUN cd shared && npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/shared/node_modules ./shared/node_modules
COPY . .
RUN npm run build

# Stage 3: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/node_modules ./shared/node_modules
COPY package*.json ./

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3003

# Expose the port
EXPOSE 3003

# Start the application
CMD ["npm", "run", "start:prod"] 