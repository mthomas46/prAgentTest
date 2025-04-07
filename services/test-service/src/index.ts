const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://task-service:3000',
    'http://balder:3002',
    'http://webhook-service:3003',
    'http://heimdal:3004'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-brokkr-token'],
  credentials: true
}));
app.use(express.json());

// ... existing code ... 