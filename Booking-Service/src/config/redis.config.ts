import Ioredis from 'ioredis';
import { serverConfig } from './index';
import Redlock from 'redlock';

const redisClient = new Ioredis(serverConfig.REDIS_URL);

export const redlock = new Redlock([redisClient], {
  driftFactor: 0.01, // time in ms
  retryCount: 10,
  retryDelay: 200, // time in ms
  retryJitter: 200, // time in ms
});
