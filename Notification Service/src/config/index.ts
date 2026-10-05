import dotenv from 'dotenv';

dotenv.config({ path: ['.env', 'src/.env'] });

type serverConfig = {
  PORT: number;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  BULL_BOARD_USERNAME: string | undefined;
  BULL_BOARD_PASSWORD: string | undefined;
};

function loadenv() {
  console.log('Environment variables loaded successfully');
}

loadenv();

export const serverConfig: serverConfig = {
PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3002,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  BULL_BOARD_USERNAME: process.env.BULL_BOARD_USERNAME,
  BULL_BOARD_PASSWORD: process.env.BULL_BOARD_PASSWORD ,
};
