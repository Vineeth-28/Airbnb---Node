import { Redis } from 'ioredis';
import { serverConfig } from './index';

function connectToRedis() {
  let connection: Redis | null = null;

  const redisConfig = {
    host: serverConfig.REDIS_HOST,
    port: Number(serverConfig.REDIS_PORT),
    maxRetriesPerRequest: null, //disable automatic reconnection
  };

  return () => {
    if (!connection) {
      try {
        connection = new Redis(redisConfig);

        connection.on('error', (error) => {
          console.error('Redis connection error:', error);
        });
      } catch (error) {
        console.error('Failed to initialize Redis client:', error);
        throw error;
      }
    }
    return connection;
  };
}

// Initialize the closure
export const getRedisClient = connectToRedis();
