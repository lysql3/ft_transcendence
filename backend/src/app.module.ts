import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { PrismaService } from './prisma/prisma.service.js';
import { createAuth } from './auth.js';
import { UsersModule } from './users/users.module.js';
import { EventsModule } from './events/events.module.js';
import { LoggerModule } from 'nestjs-pino';
import { loggerConfig } from './logger.config.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ProblemModule } from './problem/problem.module.js';
import { LanguageModule } from './language/language.module.js';
import { JudgeModule } from './judge/judge.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';

@Module({
	imports: [
		HealthModule,
		PrismaModule,
		UsersModule,
		EventsModule,
		LoggerModule.forRoot(loggerConfig),
		AuthModule.forRootAsync({
			imports: [PrismaModule],
			inject: [PrismaService],
			useFactory: (prisma: PrismaService) => ({ auth: createAuth(prisma) }),
		}),
			ProblemModule,
			LanguageModule,
			JudgeModule,
			AnalyticsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
