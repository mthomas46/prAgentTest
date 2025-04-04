FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Create a default .env file if it doesn't exist
RUN touch .env

# Expose the port
EXPOSE 3000

# Start the application in dev mode
CMD ["npm", "run", "dev"] 