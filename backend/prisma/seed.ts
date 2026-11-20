import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
	for (const name of ['python', 'cpp', 'javascript']) {
		await prisma.language.upsert({
			where: { name },
			update: {},
			create: { name },
		});
		console.log(`Language "${name}" ready`);
	}
}

main()
.then(() => console.log('Seed done'))
.catch((e) => {
	console.error('Seed failed:', e);
	process.exitCode = 1;
})
.finally(() => prisma.$disconnect());
