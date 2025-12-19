const { Queue } = require('bullmq');

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
};

const cleanupQueue = new Queue('inventory-cleanup-queue', { connection: redisConnection });

async function initScheduler() {
  await cleanupQueue.add(
    'release-expired-stock', 
    {}, 
    {
      repeat: {
        every: 60000 
      }
    }
  );
  console.log('⏰ Scheduler initialized: Cleanup job runs every 1 minute.');
}

initScheduler();