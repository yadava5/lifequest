# LifeQuest

LifeQuest is a desktop-first, real-world quest platform designed to help laid-off professionals and retirees rebuild routines, social ties, and motivation through missions, community, and tangible rewards.

This repository is the primary monorepo for the new desktop rebuild (Tauri + React) and NestJS API. The original CRA + Express + Electron prototype is preserved under `legacy/`.

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

## Legacy prototype

The original web + Electron prototype lives in `legacy/`. See `legacy/README.md` and `docs/legacy.md` for how to run it and what it contains.

## Status

This repo is actively evolving toward the desktop-first rebuild described in `docs/architecture.md`. The legacy prototype is preserved for reference and parity checks.
