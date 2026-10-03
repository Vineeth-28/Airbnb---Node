import dotenv from 'dotenv';
import { dbConfig } from './index';
dotenv.config();

// 2. Build the structured environment configuration for Sequelize CLI
const config = {
  development: {
    username: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    host: dbConfig.DB_HOST,
    dialect: 'mysql' as const,
  },
  test: {
    username: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    host: dbConfig.DB_HOST,
    dialect: 'mysql' as const,
  },
  production: {
    username: dbConfig.DB_USER,
    password: dbConfig.DB_PASSWORD,
    database: dbConfig.DB_NAME,
    host: dbConfig.DB_HOST,
    dialect: 'mysql' as const,
  },
};

// Modern ES6 export for your server source code application flow
export default config;

// CommonJS backward compatibility export strictly for Sequelize CLI
module.exports = config;
