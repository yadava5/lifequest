# LifeQuest

**Turn real-world routines into a game — built for people rebuilding after job loss or retirement.**

[![CI](https://github.com/yadava5/lifequest/actions/workflows/ci.yml/badge.svg)](https://github.com/yadava5/lifequest/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tauri 2](https://img.shields.io/badge/Tauri-2-24C8DB.svg)](https://tauri.app/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![NestJS 11](https://img.shields.io/badge/NestJS-11-E0234E.svg)](https://nestjs.com/)
[![Prisma 6](https://img.shields.io/badge/Prisma-6-2D3748.svg)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)

**[Live app](https://getlifequest.vercel.app)** · **[System Card](https://getlifequest.vercel.app/system-card)**

---

LifeQuest is a gamified routine and goal tracker with a social-good mission: it turns everyday tasks into quests for people navigating a hard transition — a layoff, a career change, or retirement. Players complete local quests (daily check-ins, meetups, career fairs, skill-building), earn **Quest Coins**, and redeem them for practical rewards, while the platform tracks progress and nudges toward job re-entry and community connection.

The landing hero is a *playable* mission card: finish it and the page pays out coins and confetti before you ever create an account. Try it live at **[getlifequest.vercel.app](https://getlifequest.vercel.app)** — a one-click seeded demo, no signup required.

LifeQuest doesn't travel alone: five sibling projects share the portfolio at [yadava5.github.io/Portfolio-2.0](https://yadava5.github.io/Portfolio-2.0/).

## Features

- **Playable onboarding** — complete a real quest on the landing page and earn coins before signing up.
- **Quests & missions** — daily check-ins, community meetups, career fairs, and skill-building tasks.
- **Quest Coins economy** — earn coins for completed quests and redeem them for practical rewards.
- **Progress tracking** — persisted quests, coins, and redemptions backed by a real Postgres database.
- **Real accounts** — email/password auth with argon2-hashed credentials and server-side Bearer sessions.
- **Desktop-first, web-ready** — one React client ships as both a native Tauri desktop app and a hosted web app.
- **Cohesive identity** — a warm "dawn expedition" palette (coral, honey, lagoon-aqua, powder-sky): no gradient branding, no purple. Not a preference; a rule the end-to-end suite enforces on computed colour.

## Architecture

LifeQuest is a TypeScript monorepo (npm workspaces) with a shared schema layer that keeps the client and API in sync.

```
Tauri 2 + React 19 client  ──►  NestJS 11 + Fastify API  ──►  Postgres (Prisma 6)
      (desktop + web)              (Vercel serverless)          (persisted state)
                     └──── @lifequest/schemas (shared Zod types) ────┘
```

### Tech stack

| Layer        | Technology                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| **Client**   | Tauri 2, React 19, Vite 7, TanStack Query, React Router, Tailwind CSS, Framer Motion |
| **API**      | NestJS 11, Fastify, Prisma 6, argon2, Zod, Pino                            |
| **Database** | PostgreSQL                                                                  |
| **Shared**   | `@lifequest/schemas` (Zod schemas + types), `@lifequest/client` (typed API helpers) |
| **Tooling**  | TypeScript, ESLint, Prettier, Vitest, Playwright, Docker Compose            |
| **Hosting**  | Vercel (web build + serverless API function)                               |

### Repository layout

```
lifequest/
├── apps/
│   ├── api/           # NestJS + Fastify API (Postgres + Prisma)
│   └── desktop/       # Tauri 2 + Vite + React client (desktop + web)
├── packages/
│   ├── client/        # Typed API client helpers (shared)
│   └── schemas/       # Zod schemas + shared types
├── docs/              # Architecture, development, deployment, assets
├── legacy/            # Original CRA + Express + Electron prototype
└── docker-compose.dev.yml  # Postgres + Redis for local dev
```

## Quick start

**Prerequisites:** Node.js 20+, npm 11+, and Docker (for local Postgres).

### 1. Start data services

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 2. API (`apps/api`)

```bash
cd apps/api
cp .env.example .env
npm install
npm run prisma:push
npm run prisma:seed
npm run dev
```

The API runs on `http://localhost:4000`.

### 3. Client (`apps/desktop`)

```bash
cd apps/desktop
npm install
npm run dev            # web dev server (Vite)
# npm run tauri dev    # native desktop shell
```

Prefer a workspace-first setup? You can install once from the repo root instead of per app — see [`docs/development.md`](docs/development.md).

## Testing

```bash
npm test -w packages/schemas    # 16 contract tests
```

`packages/schemas` is the API/client contract, and it now has **16 tests**. Until
recently the only test script in the repository was `vitest --passWithNoTests`
over zero test files — a green check that asserted nothing, which is worse than a
missing one because it occupies the slot where evidence goes.

Schemas were chosen as the starting point rather than picked arbitrarily. They
are pure, they need no database or running server, and they are exactly the kind
of code that breaks *silently*: a widened enum does not throw, it starts
accepting data the rest of the system assumed it would never see.

The load-bearing example is an asymmetry nothing in the source states.
`audienceEnum` carries three values — `LAID_OFF`, `RETIRED`, `SHARED` — while
signup and profile updates accept only two. `SHARED` describes a quest visible to
everyone; it was never something a person signs up as. The two enums sit fifty
lines apart with no comment between them, so anyone tidying up the apparent
duplication would let users register as `SHARED`, and TypeScript would not object.
There is now a test that fails if they do.

Supply-chain checks run on every push: CodeQL, full-history secret scanning, and
[OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/yadava5/lifequest),
which a third party computes and publishes rather than this repository asserting it.

## Documentation

- [`docs/README.md`](docs/README.md) — documentation index
- [`docs/development.md`](docs/development.md) — local setup and workflows
- [`docs/architecture.md`](docs/architecture.md) — architecture and design decisions
- [`docs/deployment.md`](docs/deployment.md) — deploying to Vercel
- [`docs/legacy.md`](docs/legacy.md) — the legacy prototype

## Deployment

The live app runs as a single Vercel project: the Vite web build is served as static assets, and the NestJS API runs as a serverless function (`api/index.ts`) over a hosted Postgres. See [`docs/deployment.md`](docs/deployment.md) and [`apps/api/DEPLOY.md`](apps/api/DEPLOY.md) for the full runbook.

## Legacy prototype

The original CRA + Express + Electron prototype is preserved under [`legacy/`](legacy/) for reference and parity checks. See [`legacy/README.md`](legacy/README.md) and [`docs/legacy.md`](docs/legacy.md).

## Author

**Ayush Yadav** — sole author and maintainer · [github.com/yadava5](https://github.com/yadava5)

## License

Released under the [MIT License](LICENSE).
