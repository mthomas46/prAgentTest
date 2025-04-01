# Hello World Server

This is a simple TypeScript Express server that listens on port 8080 and responds with "Hello, World!" when accessed at the root endpoint (`/`). It also includes Swagger documentation.

## Setup Instructions

### 1. Initialize a Node.js project
If you haven’t already, run:
```sh
npm init -y
```

### 2. Install dependencies
```sh
npm install express @types/express ts-node typescript swagger-ui-express swagger-jsdoc body-parser
```

### 3. Create a TypeScript configuration file
Generate a `tsconfig.json` file by running:
```sh
npx tsc --init
```
Then, ensure the following settings are enabled in `tsconfig.json`:
```json
"module": "CommonJS",
"esModuleInterop": true,
"outDir": "./dist",
"rootDir": "./"
```

### 4. Run the server
Start the server using `ts-node`:
```sh
npx ts-node index.ts
```
Or, if using `nodemon` for auto-reloading:
```sh
npm run dev
```

### 5. Access the server
Your server should now be running at [http://localhost:8080](http://localhost:8080).

### 6. API Documentation (Swagger)
Once the server is running, you can access the API documentation at:
[http://localhost:8080/api-docs](http://localhost:8080/api-docs)

### Project Structure:
```
/
├── index.ts        # Main server file
├── swagger.ts      # Swagger configuration
├── package.json    # Project metadata & dependencies
├── tsconfig.json   # TypeScript configuration
├── README.md       # Project documentation
```
