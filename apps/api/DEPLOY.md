# LifeQuest API — live deployment

The web SPA (`apps/desktop`) ships today at its Vercel URL in **demo mode**
(zero backend, in-browser fixtures). To light up the *real* backend —
persisted quests, coins, redemptions, real login — deploy this NestJS API
and point the SPA at it with a single env var. No app-code change is needed.

## What's already proven

- The Nest+Fastify graph boots outside `main.ts` and serves requests when
  imported from the **tsc-compiled `dist/`** (DI metadata is emitted by tsc,
  not by esbuild/tsx — importing `dist/` is required, not `src/`).
- Prisma connects to Supabase and `SELECT 1` succeeds; `binaryTargets`
  already includes `rhel-openssl-3.0.x` (Vercel's runtime).
- CORS is fixed (no `*`+credentials; Bearer auth needs no cookies).

## 1. Database (any Postgres)

Options, cheapest-first:
- **New Supabase project** (free) — cleanest isolation.
- **Neon** (free) — generous free Postgres.
- **Isolated schema on an existing Supabase** — set `?schema=lifequest`
  in the URL; Prisma keeps every table in that schema.

Set two URLs (Supabase shown; pooler = transaction mode :6543, direct =
session mode :5432):

```
# app runtime (pooled)
DATABASE_URL="postgresql://USER:PASS@HOST:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
# migrations only (direct/session — pgbouncer can't run DDL prepared stmts)
DIRECT_URL="postgresql://USER:PASS@HOST:5432/postgres?sslmode=require"
```

Migrate + seed once:

```
DATABASE_URL="$DIRECT_URL" npm run -w apps/api prisma:migrate    # prisma migrate deploy
DATABASE_URL="$DIRECT_URL" npm run -w apps/api prisma:seed       # creates demo@lifequest.app / LifeQuest123!
```

## 2. Serverless entry (Vercel Function)

Create `apps/api/api/index.ts` — build the app once at module scope, cache
across warm invocations, forward the raw request into Fastify:

```ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
// IMPORTANT: import the tsc-compiled output, not src (esbuild drops DI metadata)
import { AppModule } from '../dist/app.module.js';
import type { IncomingMessage, ServerResponse } from 'node:http';

let appPromise: Promise<NestFastifyApplication> | null = null;

async function bootstrap() {
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!appPromise) appPromise = bootstrap();
  const app = await appPromise;
  app.getHttpAdapter().getInstance().server.emit('request', req, res);
}
```

`apps/api/vercel.json` (build compiles to `dist/` first, then all routes hit
the one function; the Nest global prefix keeps them under `/api/*`):

```json
{
  "buildCommand": "npm --prefix ../.. run build:packages && prisma generate && tsc -p tsconfig.build.json",
  "installCommand": "npm --prefix ../.. install",
  "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
}
```

Deploy from `apps/api`: `vercel --prod` (new project, e.g. `lifequest-api`).
Env on that project: `DATABASE_URL` (pooled), `CORS_ORIGIN`
(the SPA origin), `JWT_SECRET`.

Verify: `curl https://<api>/api/health` → `{"status":"ok",...}`; a POST to
`/api/auth/login` with the seeded creds returns a session.

## 3. Point the SPA at it

On the `lifequest` Vercel project set `VITE_API_URL=https://<api>/api` and
redeploy. `apiClient` auto-switches off demo mode — done.
