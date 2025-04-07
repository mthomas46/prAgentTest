const express = require('express');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const externalService = require('./services/externalService');
const helDatabase = require('./services/helDatabase');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3007;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'brokkr' });
});

// Get data from all services
app.get('/services', async (req, res) => {
  try {
    const data = await externalService.getAllServicesData();
    res.json(data);
  } catch (error) {
    logger.error(`Error in /services endpoint: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch service data' });
  }
});

// Get all tables in Hel database
app.get('/hel/tables', async (req, res) => {
  try {
    const tables = await helDatabase.getTableNames();
    res.json(tables);
  } catch (error) {
    logger.error(`Error in /hel/tables endpoint: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch table names' });
  }
});

// Get data from a specific table
app.get('/hel/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const data = await helDatabase.getTableData(tableName);
    res.json(data);
  } catch (error) {
    logger.error(`Error in /hel/tables/:tableName endpoint: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch table data' });
  }
});

// Get schema for a specific table
app.get('/hel/schema/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const schema = await helDatabase.getTableSchema(tableName);
    res.json(schema);
  } catch (error) {
    logger.error(`Error in /hel/schema/:tableName endpoint: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch table schema' });
  }
});

// Execute a custom query
app.post('/hel/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    const results = await helDatabase.executeQuery(query);
    res.json(results);
  } catch (error) {
    logger.error(`Error in /hel/query endpoint: ${error.message}`);
    res.status(500).json({ error: 'Failed to execute query' });
  }
});

// Start the server
app.listen(port, () => {
  logger.info(`Brokkr service listening on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received. Closing HTTP server and database connection...');
  await helDatabase.close();
  process.exit(0);
}); 