import Redis from 'ioredis';

let redisClient = null;

const createRedisClient = (host = '127.0.0.1', port = 6379, password) => {
  if (!redisClient) {
    redisClient = new Redis({
      host,
      port,
      password, // Optional for authentication
      retryStrategy: (times) => {
        console.log(`Redis connection attempt: ${times}`);
        return Math.min(times * 50, 2000); // Retry every 50ms up to 2s
      },
    });

    redisClient.on('connect', () => console.log('✅ Connected to Redis'));
    redisClient.on('error', (err) => console.error('❌ Redis Error:', err));
  }
  
  return redisClient;
};

// Clean up connection on app exit
process.on('SIGINT', () => {
  if (redisClient) {
    redisClient.quit();
    console.log('Redis connection closed');
  }
  process.exit(0);
});

export default createRedisClient;
