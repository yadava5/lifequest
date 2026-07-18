import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false })
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 4000);

  // Bearer-token auth carries no cookies, so credentials must stay off —
  // and `origin: '*'` + credentials is an invalid, unsafe combination.
  // A configured CORS_ORIGIN may be a comma-separated allowlist.
  const corsOrigin = configService.get<string>('app.corsOrigin', '*');
  app.enableCors({
    origin:
      corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
    credentials: false,
  });

  app.setGlobalPrefix('api');

  await app.listen({ port, host: '0.0.0.0' });
  Logger.log(`LifeQuest API listening on port ${port}`, 'Bootstrap');
}

bootstrap();
