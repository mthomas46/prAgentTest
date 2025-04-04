# Common Build Issues and Solutions

## Bifrost Service Build Issues

### Problem: OpenTelemetry Dependency Conflicts and Node.js Compatibility

**Symptoms:**
- Build failures in Docker with dependency-related errors
- Peer dependency conflicts with OpenTelemetry packages
- Node.js version compatibility warnings
- Error messages like:
  ```
  npm ERR! ERESOLVE unable to resolve dependency tree
  ```
  or
  ```
  requires a peer of @opentelemetry/api@>=1.3.0 <1.5.0 but none is installed
  ```

**Root Causes:**
1. Node.js version mismatch
2. OpenTelemetry peer dependency conflicts
3. Incompatible package versions
4. Docker build stage dependency inconsistencies

**Solution:**

1. **Node.js Version Upgrade**
   ```dockerfile
   # In Dockerfile
   FROM node:18-alpine AS dependencies
   ```
   - Ensure Node.js 18+ is used (required by many modern packages)
   - Add engine requirement in package.json:
     ```json
     {
       "engines": {
         "node": ">=18.0.0"
       }
     }
     ```

2. **Dependency Resolution**
   - Install OpenTelemetry with specific version:
     ```bash
     npm install @opentelemetry/api@1.4.1 --legacy-peer-deps
     ```
   - Use `--legacy-peer-deps` and `--force` flags in Dockerfile:
     ```dockerfile
     RUN npm install --legacy-peer-deps --force
     ```

3. **Dockerfile Structure**
   ```dockerfile
   # Stage 1: Dependencies
   FROM node:18-alpine AS dependencies
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --legacy-peer-deps --force

   # Stage 2: Builder
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=dependencies /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Stage 3: Production
   FROM node:18-alpine AS production
   WORKDIR /app
   COPY --from=builder /app/dist ./dist
   COPY --from=builder /app/node_modules ./node_modules
   COPY package*.json ./
   ```

4. **Network Configuration**
   - Ensure the required Docker network exists:
     ```bash
     docker network create yggdrasil_network
     ```
   - Reference in docker-compose:
     ```yaml
     networks:
       yggdrasil_network:
         external: true
     ```

### Verification Steps

1. Check Node.js version:
   ```bash
   node -v  # Should be 18.x or higher
   ```

2. Verify OpenTelemetry version:
   ```bash
   npm list @opentelemetry/api  # Should be 1.4.1
   ```

3. Test the build:
   ```bash
   docker-compose -f docker-compose.bifrost.yml build --no-cache
   ```

4. Start the service:
   ```bash
   docker-compose -f docker-compose.bifrost.yml up -d
   ```

### Additional Notes

- The `--legacy-peer-deps` flag is used because OpenTelemetry packages have complex peer dependencies
- Using multi-stage builds ensures clean dependency installation
- Node.js 18+ is required for compatibility with modern packages
- Always verify network dependencies before starting services

## Other Common Issues

[To be documented as more issues are encountered and resolved] 