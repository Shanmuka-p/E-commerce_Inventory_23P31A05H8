require('dotenv').config(); // Load .env variables
const express = require('express');
const { sequelize } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the API routes
app.use('/api', apiRoutes);

// Start the Server
async function startServer() {
  try {
    // Connect to Database
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    // Sync models (Create tables if they don't exist)
    // In production, use Migrations instead of sync()
    await sequelize.sync(); 
    console.log('✅ Models synced.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
  }
}

startServer();