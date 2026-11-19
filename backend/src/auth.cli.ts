// backend/src/auth.cli.ts  (never imported by the app)
import { PrismaClient } from './generated/prisma/client.js';
import { createAuth } from './auth.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const auth = createAuth(new PrismaClient({ adapter })); // throwaway; CLI never queries
// npx @better-auth/cli generate --config src/auth.cli.ts
// npx @better-auth/cli generate --config src/auth.cli.ts --output /tmp/ba.prisma
