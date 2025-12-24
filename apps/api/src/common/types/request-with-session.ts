import type { FastifyRequest } from 'fastify';

export type RequestWithSession = FastifyRequest & {
  userId?: string;
  sessionId?: string;
};
