# LifeQuest

[![CI](https://github.com/yadava5/lifequest/actions/workflows/ci.yml/badge.svg)](https://github.com/yadava5/lifequest/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

LifeQuest is a desktop-first rebuild of a map-based quest game that turns real-world routines into missions for people navigating job loss or retirement. Players complete local quests (daily check-ins, meetups, career fairs, skill-building), earn Quest Coins, and redeem them for practical rewards while the platform tracks progress and supports job re-entry and community connection.

This repository is the primary monorepo for the new desktop rebuild (Tauri + React) and NestJS API. The original CRA + Express + Electron prototype is preserved under `legacy/`.

> **Live:** https://lifequest-sigma-fawn.vercel.app · one-click seeded demo (no signup)
>
> **2026 status — full-stack live.** The desktop-first Tauri + React client also runs on the web, backed by a NestJS + Fastify + Prisma API on Vercel serverless over a real Postgres. Real accounts (argon2-hashed), persisted quests/coins/redemptions. Identity is the "dawn expedition" palette — coral / honey / lagoon-aqua, no gradients, no purple. The landing hero is a *playable* mission card: complete it and the page pays out coins + confetti before you ever sign up. Independently audited live (2026-07): ship-ready — zero functional bugs, zero console errors, backend persistence verified end to end.

## Repository layout

```
lifequest/
├── apps/
│   ├── api/           # NestJS + Fastify API (Postgres + Prisma)
│   └── desktop/       # Tauri 2 + Vite + React desktop client
├── packages/
│   ├── client/        # API client helpers (shared)
│   └── schemas/       # Zod schemas + shared types
├── docs/              # Architecture, development, assets
├── legacy/            # CRA + Express + Electron prototype
└── docker-compose.dev.yml  # Postgres + Redis for local dev
```

## Quick start (new stack)

### 1) Start data services

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 2) API (apps/api)

```bash
cd apps/api
cp .env.example .env
npm install
npm run prisma:push
npm run prisma:seed
npm run dev
```

The API runs on `http://localhost:4000` by default.

### 3) Desktop (apps/desktop)

```bash
cd apps/desktop
npm install
npm run dev
# For the native desktop shell:
# npm run tauri dev
```

If you are using npm workspaces, you can run installs from the repo root instead of per-app. See `docs/development.md` for a workspace-first setup.

## Documentation

- `docs/README.md` - documentation index
- `docs/development.md` - local setup and workflows
- `docs/architecture.md` - architecture plan for the rebuild
- `docs/legacy.md` - legacy prototype overview and how to run it
- `docs/assets/` - concept and presentation files

## Deployment

See `docs/deployment.md` for hosting the API on Render and the web build on Vercel without changing local workflows.

## Legacy prototype

The original web + Electron prototype lives in `legacy/`. See `legacy/README.md` and `docs/legacy.md` for how to run it and what it contains.

## Status

This repo is a prototype under active development toward the desktop-first rebuild described in `docs/architecture.md`. The legacy prototype is preserved for reference and parity checks.

## AI assistance

Some code and documentation were drafted with AI assistance and reviewed by the author. To the best of our knowledge, no proprietary third-party code is included. If you believe any content conflicts with a license, please open an issue.

## License

MIT. See `LICENSE`.
