import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway.js';
import { Socket } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should reply pong with server timestamp on ping', () => {
    const mockSocket = { id: 'test-client-id' } as Socket;
    const response = gateway.handlePing(mockSocket, { test: 123 });

    expect(response).toBeDefined();
    expect(response.event).toBe('pong');
    expect(response.data).toBeDefined();
    expect(typeof response.data.timestamp).toBe('string');
    expect(new Date(response.data.timestamp).getTime()).not.toBeNaN();
    expect(response.data.clientData).toEqual({ test: 123 });
  });
});
