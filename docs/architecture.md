# LifeQuest Desktop Rebuild – Architecture Plan

## 0. Repository context

- Primary stack: `apps/desktop`, `apps/api`, and shared `packages/*`.
- Legacy prototype lives in `legacy/` (CRA + Express + Electron) for parity reference.
- Local data services are defined in `docker-compose.dev.yml` (Postgres + Redis).

## 1. Product Scope & Goals

- **Experience**: Reimagine LifeQuest as a **macOS‑first desktop app** with a large‑screen layout (no more faux mobile shell). Focus on people navigating job loss or retirement, rebuilding daily routines through quests, rewards, and community.
- **Feature Parity Targets**
  1. Auth (email/password onboarding + demo profile)
  2. Home dashboard (coins, tiering, quest highlights)
  3. Quest log (filter + completion)
  4. Rewards catalog & redemption history
  5. Community meetups + shared stories
  6. Settings (profile edits, audience toggle, progress reset)
  7. Health monitoring/smoke test parity with the legacy backend
- **Desktop Focus**: Optimised for keyboard/mouse, resizable panels, native menus, and macOS notifications. Electron is replaced by a lighter, high-performance runtime.

## 2. High-Level Architecture

```
┌───────────────────┐        HTTPS / tRPC        ┌────────────────────────────┐
│  Tauri Shell      │ ─────────────────────────► │  NestJS API (Fastify)      │
│  • React 19 + Vite│                           │  • Graph-backed REST/tRPC   │
│  • shadcn/Tailwind│ ◄──────────────────────── │  • Prisma + PostgreSQL      │
│  • TanStack Query │        WebSocket (later)   │  • BullMQ workers           │
└───────────────────┘                            └────────────────────────────┘
            │                                              │
            │Commands/Plugins                              │ORM + Migrations
            ▼                                              ▼
     Native macOS APIs                             PostgreSQL + Redis
```

- The **desktop UI** is bundled via **Tauri 2** (Rust backend) + **Vite/React** front-end. Tauri grants native menus, notifications, and secure window management with a smaller footprint than Electron.
- The **API** remains a separate service (NestJS 11 with Fastify adapter). It exposes REST + tRPC endpoints consumed by the desktop client and future channels.
- **Persistence**: PostgreSQL + Prisma ORM. Redis backs BullMQ for async job orchestration (e.g., scheduled quests, meetup reminders).
- **Shared packages**: A `/packages` workspace provides TypeScript types, shared schemas (zod), and API clients to keep desktop + backend in sync.

## 3. Technology Decisions

| Layer | Technologies | Rationale |
|-------|--------------|-----------|
| Desktop shell | **Tauri 2**, **Vite**, **React 19**, **TypeScript** | Fast startup, macOS-native integration, modern React features (Server Components not needed). |
| UI System | **shadcn/ui (Radix primitives)**, **Tailwind CSS**, **Framer Motion** | Rapidly themeable component library with accessible defaults; easier to craft desktop layouts. |
| State/Data | **TanStack Query** for server cache, **Zustand** for lightweight local state | Keeps data fetching declarative; avoids Redux boilerplate. |
| Forms/Validation | **React Hook Form** + **Zod** | Shared schemas between client and server; type-safe validation. |
| API | **NestJS 11** (Fastify), **tRPC** layer (via `@trpc/server` adapter), **OpenAPI** docs | Opinionated structure, DI, and testing utilities; tRPC gives end-to-end types for desktop client. |
| Persistence | **Prisma ORM** targeting **PostgreSQL 16** | Mature type-safe ORM with migration tooling; easy to extend models. |
| Background jobs | **BullMQ** + **Redis** | Quest reminders, meetups sync, email digests. |
| Auth | **Lucia** (Nest adapter) + **JWT** stored in secure cookies (desktop uses Tauri secure storage). Optional OAuth later. |
| Telemetry | **Pino** logging + **OpenTelemetry** (OTLP exporter) | Structured logs and tracing for API + jobs. |
| Testing | Desktop: **Vitest** + **React Testing Library**; E2E: **Playwright** (drives Tauri build). Backend: **Jest** (Nest default) + **Supertest**; contract checks via **Pactum**. |
| Tooling | **npm** workspaces + **Turborepo**, **ESLint/Prettier** shared configs, **Husky** pre-commit hooks | Consistent lint/test pipelines, parallel builds. |

## 4. Module Breakdown

1. **apps/desktop** (Tauri)
   - `src/main.ts` Rust commands (secure storage, notifications)
   - `src/App.tsx` React shell (multi-pane layout)
   - Feature modules: Home, Quests, Rewards, Community, Settings
   - Hooks: `useSession`, `useQuestActions`, `useMeetups`
2. **apps/api**
   - Nest modules: `AuthModule`, `UsersModule`, `QuestsModule`, `RewardsModule`, `MeetupsModule`, `HealthModule`
   - Prisma service + repositories
   - Background worker (BullMQ) for quest reset, meetup fetch
3. **packages/**
   - `schemas`: zod schemas & Prisma type exports
   - `client`: generated tRPC hooks, REST fallback client
   - `ui`: shared tokens/theme for future channels

## 5. Domain Model Snapshot

| Entity | Key Fields |
|--------|------------|
| `User` | id (uuid), name, email, audience (`LAID_OFF`/`RETIRED`), coins, tier, onboardingState |
| `Quest` | id, title, description, audience, type (`TASK`, `COMMUNITY`, `WELLNESS`), reward, requirements |
| `QuestProgress` | id, userId, questId, status (`PENDING`, `IN_PROGRESS`, `COMPLETED`), notes, completedAt |
| `Reward` | id, name, description, cost, fulfillmentType |
| `Redemption` | id, userId, rewardId, createdAt, status |
| `Meetup` | id, title, location, startsAt, audience, RSVP link |

Prisma migrations will codify these with auditing columns (`createdAt`, `updatedAt`). Seeds will preload demo quests, rewards, and meetups.

## 6. Deployment & Dev Workflow

- **Dev**: run `docker compose -f docker-compose.dev.yml up -d` for Postgres/Redis, then start the API (`apps/api`) and desktop app (`apps/desktop`) with their local scripts.
- **CI**: GitHub Actions (matrix for desktop lint/test, backend lint/test, Playwright E2E against packaged Tauri build).
- **Release**:
  - API packaged as Docker image -> Fly.io/Render (or k8s cluster).
  - Desktop app notarized & signed for macOS via `tauri signer`, distributed as `.dmg`.
- **Monitoring**: Health endpoint `/healthz`, smoke test similar to legacy but targeting new stack, Sentry for desktop crash/error reporting.

## 7. Dependency Inventory

### Desktop (apps/desktop)
- `react`, `react-dom`, `@tanstack/react-query`, `zustand`
- `@shadcn/ui`, `@radix-ui/react-*`, `tailwindcss`, `clsx`, `lucide-react`, `framer-motion`
- `react-hook-form`, `zod`
- `@tauri-apps/api`, `tauri-plugin-store-api`
- `axios` (fallback), `@trpc/client`

### API (apps/api)
- `@nestjs/core`, `@nestjs/platform-fastify`, `@nestjs/config`, `@nestjs/passport`
- `@trpc/server`, `@trpc/client`, `zod`
- `prisma`, `@prisma/client`
- `pg`, `pino`, `pino-pretty`
- `bullmq`, `ioredis`
- `lucia`, `argon2` (password hashing)
- Testing: `jest`, `ts-jest`, `supertest`, `pactum`

### Shared / Tooling
- `typescript`, `ts-node`, `tsx`
- `eslint`, `@typescript-eslint/*`, `prettier`
- `vitest`, `@vitejs/plugin-react`
- `playwright`
- `turbo`, `npm`, `husky`, `lint-staged`

## 8. Next Steps

1. Scaffold the npm workspace (`apps/desktop`, `apps/api`, `packages/schemas`, `packages/client`).
2. Provision Postgres + Redis containers, add Prisma schema + seed script aligned with the domain snapshot.
3. Begin backend module scaffolding (Phase 2) followed by the desktop shell (Phase 3).

This document is the reference for all subsequent rebuild work.

## 9. Phase 5 – Auth & API Integration

| Track | Deliverables |
|-------|--------------|
| **Identity** | Email + password signup/login using Argon2 hashing plus session records (Lucia-compatible) stored in Postgres. Endpoints: `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/session`. Sessions exchanged via bearer tokens stored in the Tauri secure store. |
| **Guards** | Nest guard that validates bearer tokens, attaches `userId` + `sessionId` to the request, and decorators (`@CurrentUser`, `@CurrentSession`). All user-facing routes (quests, rewards, settings, reset, redemptions) must drop `userId` payloads and trust the guard. |
| **User APIs** | `GET /users/me`, `PATCH /users/me`, `POST /users/me/reset` backed by Prisma + Zod DTOs. Responses reuse the presenter already powering the desktop store. |
| **Shared Types** | Kick off `/packages/schemas` with Zod definitions for auth/login/signup payloads + API responses to be consumed by both Nest and the desktop client (via `@lifequest/schemas`). |
| **Desktop wiring** | Replace the temporary local-only store with TanStack Query hooks that call the new auth endpoints, persist the session token (Tauri secure store), and hydrate Zustand with the API payloads. |

**Success Criteria**
- New users can sign up, receive a session token, and immediately see quests/rewards tied to their audience.
- Returning users log in, session tokens refresh, and guarded endpoints no longer accept `userId` in the payload.
- Desktop build uses the shared schemas to keep forms + API validation in sync (no duplicate Zod definitions).

### AI-Driven Quest & Reward Refresh

- **Service**: `ContentModule` (Nest) periodically regenerates quests (daily + weekly) and rewards (monthly) using the Hugging Face Inference API with an open-source instruction model (`HF_MODEL`, default `mistralai/Mistral-7B-Instruct`).
- **Configuration**: set `HF_API_TOKEN` in `apps/api/.env`. When unset, the generator is skipped and existing static content remains.
- **Storage**: `ContentGeneration` Prisma model tracks the last generation timestamp by key (`quests`, `rewards`). Every time the API process starts or a client requests `/quests`/`/rewards`, the scheduler checks the timestamp and refreshes if the cadence window has elapsed (1 day for quests, 30 days for rewards).
- **Flow**: Generated JSON is validated with shared Zod schemas, persisted via Prisma, and quest progress is reset per user to align with the new catalog.
