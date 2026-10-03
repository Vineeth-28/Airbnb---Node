import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Reads DATABASE_URL from your .env file, fallback to the exact local MySQL string if needed
const databaseUrl =
  process.env['DATABASE_URL'] ?? 'mysql://root:Vineet@12345@localhost:3306/Airbnb_BookingService';

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
