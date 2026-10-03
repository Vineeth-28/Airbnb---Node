import dotenv from 'dotenv';

type serverConfig = {
  PORT: number;
};

type DBConfig = {
  DB_DATABASE: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
};

function loadenv() {
  dotenv.config(); // Fixed: Added actual execution of dotenv
  console.log('Environment variables loaded successfully');
}

loadenv();

export const serverConfig: serverConfig = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
};

// Fixed: Cleaned up assignment syntax and added missing DB_DATABASE
export const dbConfig: DBConfig = {
  DB_DATABASE: process.env.DB_DATABASE || 'airbnbNode',
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'vineet@123',
  DB_NAME: process.env.DB_NAME || 'airbnbNode',
};
