FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Create the public directory in the dist folder and copy the correct index.html
RUN mkdir -p dist/public && cp -r public/* dist/public/

# Remove any old Elm-related files
RUN rm -f dist/public/main.js

EXPOSE 3003

CMD ["npm", "run", "start:prod"] 