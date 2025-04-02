FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application with verbose output
RUN npm run build --verbose

# List contents of dist directory
RUN ls -la dist/

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"] 