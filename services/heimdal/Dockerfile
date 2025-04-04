FROM node:18-alpine

WORKDIR /app

# Install PostgreSQL client tools
RUN apk add --no-cache postgresql-client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["npm", "start"] 