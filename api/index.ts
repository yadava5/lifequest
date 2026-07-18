import 'reflect-metadata';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { IncomingMessage, ServerResponse } from 'node:http';

// Vercel serverless entry for the NestJS + Fastify API (see apps/api/DEPLOY.md).
// The app is built once at module scope and reused across warm invocations
// (Fluid Compute); requests are forwarded straight into Fastify's HTTP server.
let appPromise: Promise<NestFastifyApplication> | null = null;

async function bootstrap(): Promise<NestFastifyApplication> {
  const { NestFactory } = await import('@nestjs/core');
  const { FastifyAdapter } = await import('@nestjs/platform-fastify');
  // Import the tsc-COMPILED app (dist), never src: NestJS DI relies on
  // emitDecoratorMetadata, which tsc emits and esbuild/@vercel/node does not.
  const { AppModule } = await import('../apps/api/dist/app.module.js');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  const origin = process.env.CORS_ORIGIN ?? '*';
  app.enableCors({
    origin: origin === '*' ? true : origin.split(',').map((o) => o.trim()),
    credentials: false,
  });
  app.setGlobalPrefix('api');
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
  return app;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    if (!appPromise) appPromise = bootstrap();
    const app = await appPromise;
    app.getHttpAdapter().getInstance().server.emit('request', req, res);
  } catch (err) {
    appPromise = null; // allow a fresh attempt on the next request
    console.error('LifeQuest API bootstrap failed:', err);
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ error: 'API failed to start' }));
  }
}
