import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { createAuth } from '../auth.js';

@Module({
	imports: [PrismaModule],
	providers: [
		{
			provide: 'AUTH',
			inject: [PrismaService],
			useFactory: (prisma: PrismaService) => createAuth(prisma),
		},
			EventsGateway,
	],
	exports: [EventsGateway],
})
export class EventsModule {}
