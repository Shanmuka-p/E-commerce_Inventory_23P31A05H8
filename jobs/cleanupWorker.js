// jobs/cleanupWorker.js
const { Worker } = require('bullmq');
const { Reservation } = require('../models');
const { Op } = require('sequelize');

// Connection details for Redis (from your docker-compose)
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

const worker = new Worker('inventory-cleanup-queue', async (job) => {
  console.log('🧹 Cleanup Job Started...');

  try {
    // 1. Find and Delete expired reservations
    // SQL Equivalent: DELETE FROM reservations WHERE expiresAt < NOW()
    const result = await Reservation.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date() // "Less Than" Now
        }
      }
    });

    if (result > 0) {
      console.log(`✅ Released ${result} expired items back to inventory.`);
    } else {
      console.log('zzz No expired items found.');
    }

  } catch (error) {
    console.error('❌ Cleanup Job Failed:', error);
  }

}, { connection: redisConnection });

console.log('Inventory Cleanup Worker is running...');