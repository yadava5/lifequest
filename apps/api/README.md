# LifeQuest API

NestJS + Fastify API for the LifeQuest desktop rebuild.

## Requirements

- Postgres 16+
- Redis 7+

Local services are available via `docker-compose.dev.yml` in the repo root.

## Setup

```bash
cp .env.example .env
npm install
npm run prisma:push
npm run prisma:seed
npm run dev
```

The API runs on `http://localhost:4000/api` by default. Health check: `GET /api/health`.

## Scripts

- `npm run dev` - hot-reload dev server
- `npm run build` - production build
- `npm run start` - run the built server
- `npm run prisma:push` - sync Prisma schema
- `npm run prisma:seed` - seed demo data
- `npm run test` - run tests (vitest)
