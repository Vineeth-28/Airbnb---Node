import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to connect to the booking database.');
}

const prisma = new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) });

export default prisma;
