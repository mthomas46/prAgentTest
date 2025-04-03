FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Install curl for healthcheck
RUN apk add --no-cache curl

EXPOSE 3000

CMD ["npm", "run", "start"] 