// config/database.js
const { Sequelize } = require('sequelize');

// Create the connection using variables from .env
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecommerce_inventory',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Set to true if you want to see raw SQL queries
  }
);

module.exports = { sequelize };