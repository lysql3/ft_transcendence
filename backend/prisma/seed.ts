import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Languages
  const cpp = await prisma.language.upsert({
    where: { name: 'cpp' },
    update: {},
    create: { name: 'cpp' },
  });

  const python = await prisma.language.upsert({
    where: { name: 'python' },
    update: {},
    create: { name: 'python' },
  });

  const javascript = await prisma.language.upsert({
    where: { name: 'javascript' },
    update: {},
    create: { name: 'javascript' },
  });

  console.log(`Created languages: ${cpp.name}, ${python.name}, ${javascript.name}`);

  // 2. Users & Profiles
  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: {
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: 'placeholder_hash_alice',
      rating: 1200,
      profile: {
        create: {
          displayName: 'Alice Wonder',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alice',
          bio: 'Competitive programmer & algorithm enthusiast',
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { username: 'bob' },
    update: {},
    create: {
      username: 'bob',
      email: 'bob@example.com',
      passwordHash: 'placeholder_hash_bob',
      rating: 1150,
      profile: {
        create: {
          displayName: 'Bob Builder',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=bob',
          bio: 'Fullstack coder and gamer',
        },
      },
    },
  });

  const charlie = await prisma.user.upsert({
    where: { username: 'charlie' },
    update: {},
    create: {
      username: 'charlie',
      email: 'charlie@example.com',
      passwordHash: 'placeholder_hash_charlie',
      rating: 1000,
      profile: {
        create: {
          displayName: 'Charlie Root',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=charlie',
          bio: 'Speed typing champion',
        },
      },
    },
  });

  console.log(`Created users: ${alice.username}, ${bob.username}, ${charlie.username}`);

  // 3. Sample Problems & TestCases
  const twoSum = await prisma.problem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      difficulty: 'EASY',
      testCases: {
        create: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            expectedOutput: '[0,1]',
            isHidden: false,
          },
          {
            input: 'nums = [3,2,4], target = 6',
            expectedOutput: '[1,2]',
            isHidden: false,
          },
          {
            input: 'nums = [3,3], target = 6',
            expectedOutput: '[0,1]',
            isHidden: true,
          },
        ],
      },
    },
  });

  const reverseString = await prisma.problem.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: 'Reverse String',
      description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
      difficulty: 'EASY',
      testCases: {
        create: [
          {
            input: '["h","e","l","l","o"]',
            expectedOutput: '["o","l","l","e","h"]',
            isHidden: false,
          },
          {
            input: '["H","a","n","n","a","h"]',
            expectedOutput: '["h","a","n","n","a","H"]',
            isHidden: true,
          },
        ],
      },
    },
  });

  console.log(`Created problems: ${twoSum.title}, ${reverseString.title}`);

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

