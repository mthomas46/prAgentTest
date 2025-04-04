# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Install Elm
RUN apk add --no-cache curl
RUN curl -L -o elm.gz https://github.com/elm/compiler/releases/download/0.19.1/binary-for-linux-64-bit.gz
RUN gunzip elm.gz
RUN chmod +x elm
RUN mv elm /usr/local/bin/

# Build Elm and TypeScript
RUN mkdir -p dist/public
RUN yes | elm make src/Frontpage.elm --output=dist/public/elm.js
RUN npm run build
RUN cp -r public/* dist/public/

# Stage 3: Production
FROM node:18-alpine
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