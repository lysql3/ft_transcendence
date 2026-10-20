import { randomUUID } from 'crypto';

export const loggerConfig = {
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,

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
