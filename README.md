# prAgentTest

Hello World Server

This is a simple TypeScript Express server that listens on port 8080 and responds with "Hello, World!" when accessed at the root endpoint (/).

Setup Instructions

1. Initialize a Node.js project

If you haven’t already, run:

npm init -y

2. Install dependencies

npm install express @types/express ts-node typescript

3. Create a TypeScript configuration file

Generate a tsconfig.json file by running:

npx tsc --init

Then, ensure the following settings are enabled in tsconfig.json:

"module": "CommonJS",
"esModuleInterop": true

4. Run the server

Start the server using ts-node:

npx ts-node <your-file-name>.ts

Replace <your-file-name>.ts with the actual filename of your script.

5. Access the server

Your server should now be running at http://localhost:8080. 🚀