# Stage 1: Dependencies
FROM node:18-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --force && \
    npm install pg --save --force

# Stage 2: Builder
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build && \
    ls -la dist/ && \
    cat dist/main.js

# Stage 3: Production
FROM node:18-alpine as production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

RUN apk add --no-cache curl && \
    npm install pg --save && \
    chown -R node:node /app && \
    ls -la dist/ && \
    cat dist/main.js

ENV PORT=3000
EXPOSE 3000

USER node
CMD ["node", "dist/main.js"] 