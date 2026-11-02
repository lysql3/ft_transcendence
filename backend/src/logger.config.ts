import { randomUUID } from 'crypto';

export const loggerConfig = {
  pinoHttp: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              singleLine: true,
            },
          }
        : undefined,
    level: process.env.LOG_LEVEL || 'info',
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["set-cookie"]',
        'res.headers.authorization',
        'res.headers.cookie',
        'res.headers["set-cookie"]',
      ],
      censor: '[REDACTED]',
    },
    customProps: (req: unknown) => {
      const request = req as {
        id?: string;
        user?: { id?: string };
      };

      return {
        service: process.env.SERVICE_NAME || 'backend',
        requestId: request.id,
        userId: request.user?.id ?? null,
      };
    },

    customLogLevel: (
      _req: unknown,
      res: {
        statusCode: number;
        setHeader: (name: string, value: string) => void;
      },
      error?: Error,
    ) => {
      if (error || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    genReqId: (
      _req: unknown,
      res: { setHeader: (name: string, value: string) => void },
    ) => {
      const id = randomUUID();
      res.setHeader('X-Request-Id', id);
      return id;
    },
  },
};
