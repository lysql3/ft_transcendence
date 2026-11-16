import { randomUUID } from 'crypto';

type ReqLike = {
  id?: string;
  method?: string;
  url?: string;
  ip?: string;
  query?: unknown;
  params?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

export const loggerConfig = {
  pinoHttp: {
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              singleLine: false,
              ignore: 'pid,hostname',
            },
          }
        : undefined,

    level: process.env.LOG_LEVEL || 'info',
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,

    // Allowlist: only these fields are ever logged, in dev and in prod.
    serializers: {
      req: (req: ReqLike) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query, // drop this when OAuth (5.1) lands: callbacks carry `code`/`state`
        params: req.params,
        ip: req.ip,
        userAgent: req.headers?.['user-agent'],
        origin: req.headers?.origin,
      }),
      res: (res: { statusCode?: number }) => ({
        statusCode: res.statusCode,
      }),
    },

    // Second layer, in case someone later adds headers to the serializer.
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
        session?: { user?: { id?: string } };
      };

      return {
        service: process.env.SERVICE_NAME || 'backend',
        requestId: request.id,
        userId: request.user?.id ?? request.session?.user?.id ?? null,
      };
    },

    customLogLevel: (
      _req: unknown,
      res: { statusCode: number },
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

    // Enable once you've confirmed the healthcheck lines show
    // userAgent "Wget" and ip 127.0.0.1 / ::1:
    // autoLogging: {
    //   ignore: (req: { url?: string }) => req.url === '/api/health',
    // },
  },
};
