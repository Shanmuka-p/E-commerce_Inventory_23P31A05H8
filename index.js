require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/database');
const apiRoutes = require('./routes/api');

require('./jobs/cleanupWorker');
require('./jobs/scheduler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', apiRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected.');

    await sequelize.sync(); 
    console.log('✅ Models synced.');

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    }

  } catch (error) {
    console.error('❌ Unable to start server:', error);
  }
}

startServer();

module.exports = app;