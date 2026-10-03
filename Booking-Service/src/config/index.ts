import dotenv from 'dotenv';

type serverConfig = {
  PORT: number;
  REDIS_URL: string;
  LOCK_TTL: number;
};

dotenv.config();

export const serverConfig: serverConfig = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  LOCK_TTL: process.env.LOCK_TTL ? parseInt(process.env.LOCK_TTL, 10) : 120000,
};
