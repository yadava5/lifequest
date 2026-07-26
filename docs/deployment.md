# Deployment

LifeQuest is deployed to production as a **single Vercel project**: the Vite web
build (`apps/desktop`) is served as static assets, and the NestJS API
(`apps/api`) runs as a Vercel serverless function over a hosted Postgres. No
separate API host is required, and local development commands are unchanged.

## Vercel (web + API in one project)

The repo root `vercel.json` wires everything together:

- **Build** — compiles the shared packages, generates the Prisma client, builds
  the API, then builds the web client. Output is `apps/desktop/dist`.
- **API** — `api/index.ts` runs as a serverless function; all `/api/*` requests
  are routed to it (the NestJS global prefix keeps routes under `/api`).
- **Routing** — `/system-card` serves the System Card; everything else falls
  back to the SPA entry point.

### Setup

1. Create a Vercel project and import this repo.
2. Provision a Postgres database (Vercel Postgres, Neon, or Supabase all work).
3. Set the project environment variables:

   ```
   DATABASE_URL   # pooled connection string used at runtime
   DIRECT_URL     # direct connection string used for migrations
   JWT_SECRET     # secret used to sign session tokens
   CORS_ORIGIN    # the deployed web origin (optional; defaults permissive)
   ```

4. Run migrations and seed once against `DIRECT_URL`:

   ```bash
   DATABASE_URL="$DIRECT_URL" npm run -w apps/api prisma:migrate
   DATABASE_URL="$DIRECT_URL" npm run -w apps/api prisma:seed
   ```

5. Deploy. The web app and API are then live under the same origin
   (`https://<project>.vercel.app`, with the API at `/api/*`).

See [`apps/api/DEPLOY.md`](../apps/api/DEPLOY.md) for the detailed serverless
runbook, including the Nest + Fastify function entry point and the constraints
around compiling to `dist/` for Prisma and dependency-injection metadata.

## Local workflow (unchanged)

The deploy configuration does not change local development:

```bash
npm install
npm run build:packages
npm run lint:api
CI=true npm run test:api
npm run lint:desktop
npm run build:desktop
```

```bash
docker compose -f docker-compose.dev.yml up -d
npm run dev:api
npm run dev:desktop
```
