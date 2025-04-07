const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Hel Database Configuration
 * Named after the Norse realm of the dead, Hel serves as the home for test data.
 * Production data can be copied here for testing but will be rolled back after automated tests.
 */
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.HEL_DB_HOST || 'localhost',
  port: parseInt(process.env.HEL_DB_PORT || '5432'),
  username: process.env.HEL_DB_USERNAME || 'postgres',
  password: process.env.HEL_DB_PASSWORD || 'postgres',
  database: process.env.HEL_DB_DATABASE || 'hel',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize; 