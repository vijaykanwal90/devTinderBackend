// redisClient.js
const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: 'redis-15956.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 15956,
  },
  password: 'doW6dsgkBc5okXtGtSslLlSt6HwLs9ih',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = { redisClient, connectRedis };
