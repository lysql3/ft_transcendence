import { config } from 'dotenv';
import * as path from 'node:path';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from './prisma/prisma.service.js';
import { username } from 'better-auth/plugins/username';

config({ path: path.resolve(process.cwd(), '../.env') });

const prisma = new PrismaService();

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
if (!betterAuthSecret) {
  throw new Error('BETTER_AUTH_SECRET is required');
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  secret: betterAuthSecret,
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  trustedOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
    }),
  ],
});
