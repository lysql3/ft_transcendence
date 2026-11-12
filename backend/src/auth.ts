import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from './prisma/prisma.service.js';
import { username } from 'better-auth/plugins/username';

const prisma = new PrismaService();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

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
