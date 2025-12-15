// jobs/scheduler.js
const { Queue } = require('bullmq');

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

const cleanupQueue = new Queue('inventory-cleanup-queue', { connection: redisConnection });

async function initScheduler() {
  // Add a job that repeats every 60,000 milliseconds (1 minute)
  await cleanupQueue.add(
    'release-expired-stock', 
    {}, // No specific data needed for this job
    {
      repeat: {
        every: 60000 
      }
    }
  );
  console.log('⏰ Scheduler initialized: Cleanup job runs every 1 minute.');
}

initScheduler();