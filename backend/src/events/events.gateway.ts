import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import type { createAuth } from '../auth.js';

type Auth = ReturnType<typeof createAuth>;

@WebSocketGateway({
	cors: { origin: process.env.FRONTEND_URL, credentials: true },
})
@WebSocketGateway()
export class EventsGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger(EventsGateway.name);

	constructor(@Inject('AUTH') private readonly auth: Auth) {}

	afterInit() {
		this.logger.log('EventsGateway initialized');
	}

	async handleConnection(client: Socket) {
		const session = await this.auth.api.getSession({
			headers: fromNodeHeaders(client.handshake.headers),
		});

		if (!session) {
			this.logger.warn(`Unauthenticated client refused: ${client.id}`);
			client.disconnect();
			return;
		}

		await client.join(`user:${session.user.id}`);
		this.logger.log(`Client ${client.id} joined user:${session.user.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('ping')
	handlePing(@ConnectedSocket() client: Socket, @MessageBody() data?: unknown) {
		const timestamp = new Date().toISOString();
		this.logger.log(`Received ping from ${client.id}`);
		return {
			event: 'pong',
			data: { timestamp, clientData: data },
		};
	}
}
