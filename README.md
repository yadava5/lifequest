<p align="center">
  <img src="docs/branding/readme-light.svg#gh-light-mode-only" width="800" alt="LifeQuest">
  <img src="docs/branding/readme-dark.svg#gh-dark-mode-only" width="800" alt="LifeQuest">
</p>

<h1 align="center">LifeQuest</h1>

<p align="center">
  <strong>A desktop-first quest tracker for people rebuilding after job loss or retirement — routines become missions, missions pay coins, and the tier ladder reads cumulative earnings, so spending a reward can never walk you backwards.</strong>
</p>

<p align="center">
  <a href="https://getlifequest.vercel.app"><strong>Live App</strong></a> •
  <a href="https://getlifequest.vercel.app/system-card"><strong>System Card</strong></a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#testing">Testing</a> •
  <a href="#getting-started">Getting Started</a>
</p>

<p align="center">
  <a href="https://github.com/yadava5/lifequest/actions/workflows/ci.yml"><img src="https://github.com/yadava5/lifequest/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <img src="https://img.shields.io/badge/tests-22%20unit%20%2B%20contract%20cases-brightgreen" alt="Tests">
  <img src="https://img.shields.io/badge/Tauri-2-24C8DB.svg" alt="Tauri 2">
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg" alt="React 19">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E.svg" alt="NestJS 11">
  <img src="https://img.shields.io/badge/Prisma-6-2D3748.svg" alt="Prisma 6">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
</p>

<p align="center">
  LifeQuest is one of six projects presented together at
  <a href="https://yadava5.github.io/Portfolio-2.0/">yadava5.github.io/Portfolio-2.0</a>.
</p>

---

## Overview

LifeQuest turns the daily work of a hard transition — a layoff, a career change, retirement — into quests. Send three applications, reconnect with a mentor, take a real break: each one pays **Quest Coins**, which buy practical rewards from a catalogue, and each one also advances a tier ladder that never regresses. The public landing page is playable before you have an account: complete the hero mission and the page pays out coins and confetti on the spot.

It is a TypeScript monorepo on npm workspaces. One React 19 client renders in a Tauri 2 window or a browser; a NestJS 11 API on Fastify serves 14 REST routes over Postgres through Prisma 6; and two shared packages — `@lifequest/schemas` (Zod) and `@lifequest/client` (typed fetch helpers) — are the single definition of the contract between them. In production the whole thing is one Vercel project: static SPA plus a single serverless function.

### Why it's interesting

- **A two-ledger coin model that makes advancement monotonic.** `completeQuest` increments `coins` *and* `lifetimeCoins` in one Prisma transaction (`apps/api/src/quests/quests.service.ts`); `redeem` decrements only `coins` (`rewards.service.ts`). Tier is computed from lifetime earnings alone (`apps/desktop/src/lib/tiers.ts`), so redeeming can never demote you. Two Playwright specs assert exactly that.
- **One client, two runtimes, one environment variable.** `apps/desktop/src/lib/apiClient.ts` returns the live typed client when `VITE_API_URL` is set and a 210-line zero-backend `demoClient.ts` when it is not — same surface, no app-code branch. The deployed bundle inlines `VITE_API_URL="/api"`, so production is the live path and the in-browser demo is the fallback.
- **The whole REST surface is one serverless function.** `api/index.ts` boots the Nest graph once at module scope and re-emits raw requests into Fastify. It imports the **tsc-compiled `apps/api/dist/`**, never `src/`, because Nest's DI needs `emitDecoratorMetadata` and esbuild does not emit it — the constraint is documented at the import site.
- **Contract tests aimed at what breaks silently.** The 16 cases in `packages/schemas/src/index.test.ts` pin an asymmetry nothing in the source states: `audienceEnum` has three values (`LAID_OFF`, `RETIRED`, `SHARED`) while signup and profile updates accept two. `SHARED` is a quest audience, never a person. The enums sit fifty lines apart with no comment between them.
- **A colour rule enforced on computed styles, not source.** Two of the 20 Playwright specs walk every element's resolved `color` / `background` / `border` / `fill` / `stroke` / `boxShadow`, convert to HSL, and count anything in the 255–330° purple band with meaningful saturation. The dawn palette is coral, honey-gold, lagoon-aqua and powder-sky only, so the count must be exactly `0`.

---

## Features

### The coin and tier ledger

The signature mechanism is that there are two balances, and only one of them can go down:

```
Complete a quest ──────────────────────────────────────────────────┐
  quests.service.ts · completeQuest()                              │
      │  single prisma.$transaction                                │
      ├─► questProgress.status    = COMPLETED, completedAt = now()  │
      ├─► user.coins             += quest.reward   ← spendable     │
      └─► user.lifetimeCoins     += quest.reward   ← cumulative    │
                                                                   │
Redeem a reward ───────────────────────────────────────────────────┤
  rewards.service.ts · redeem()                                    │
      │  single prisma.$transaction  (400 if coins < cost)         │
      ├─► user.coins             -= reward.cost    ← spendable     │
      ├─► user.lifetimeCoins        UNTOUCHED                      │
      └─► redemption row created                                   │
                                                                   ▼
                                          tierProgress(lifetimeCoins)
                        EXPLORER 0 · ADVENTURER 500 · TRAILBLAZER 1800 · LUMINARY 4000
```

### Quests and progress

- **Audience-scoped catalogue** — signup bootstraps quest progress for every quest matching the player's audience or tagged `SHARED`; switching audience in Settings re-syncs the set in a transaction.
- **Three states** — `PENDING → IN_PROGRESS → COMPLETED`. `start` is idempotent (a second call on an in-progress quest returns the same row); both `start` and `complete` reject an already-completed quest with a 409.
- **Daily rituals** — a separate `RitualLog` table, read back filtered to today, so the ritual row on Mission Control resets at midnight without touching quest state.

### Rewards and community

- **Reward catalogue and redemption** — costs ordered cheapest-first; the last ten redemptions ride along on `GET /api/users/me` and fill the trophy shelf.
- **Guild screen** — shares the player's latest win, grounded in real state (most recent redemption, else most recent cleared quest).
- **Meetups (API only)** — `GET /api/meetups` filters seeded meetups by audience, but `@lifequest/client` exposes no `meetups` method and `CommunityScreen.tsx` renders the static `demoMeetups` fixture from `apps/desktop/src/data/demo.ts`. **Nothing in the client calls the endpoint.**

### Accounts and sessions

- **argon2 credentials** — no JWTs anywhere. `SessionService` issues an opaque Postgres session row with a 7-day TTL; `SessionGuard` reads it from a `Bearer` header, validates expiry, deletes expired rows, and attaches `userId` / `sessionId` to the request. Nine of the 14 routes sit behind it.
- **Demo-account identity freeze** — `demo@lifequest.app` is shared and its password is published in `apps/api/DEPLOY.md`, so `UsersService.update` silently drops `name` and `email` writes for it (case-insensitively) while leaving the audience toggle editable. Six unit tests cover this; it is the invariant with a real consequence behind it.
- **Session expiry is handled on the client too** — a returning visitor with a lapsed persisted session is dropped back to the landing and the dead session purged, rather than stranded in a shell where every write 401s.

### Client surfaces

- **One React 19 codebase, two shells** — Vite serves it on `:5173` for the web; `npm run tauri dev` runs the same build inside a Tauri 2 window. No packaged, signed or released binary exists (see [below](#planned--not-in-this-build)).
- **Responsive to a phone** — a desktop sidebar and a folded bottom tab bar, both exercised by the Playwright suite at 1280×900 and 375×812.
- **Dawn-expedition identity** — deep-lagoon night and warm-paper day, four accent tokens (`--coral`, `--gold`, `--teal`, `--sky`) declared in `apps/desktop/src/index.css`. Theme choice persists across reloads.

### AI-refreshed content (dormant without a key)

`ContentModule` can regenerate the quest catalogue once a day and the reward catalogue once a month, validating the model's JSON with a Zod schema that bounds reward costs before a single row is written. There is no job runner: `ContentSchedulerService` is called lazily from the users, quests and rewards services, so regeneration fires on the first request after the window elapses. `AiContentService` prefers `OPENAI_API_KEY`, falls back to `HF_API_TOKEN`, and **with neither set logs a warning and returns `null`** — the scheduler then no-ops and the seeded catalogue stands. That is the default state of the repository.

---

## Architecture

### System overview

```mermaid
flowchart TB
    subgraph Client["Client — React 19 + Vite 7"]
        UI["Screens<br/>Mission Control · Quests<br/>Rewards · Guild · Settings"]
        Zustand["journeyStore · tabStore · toastStore<br/>Zustand, persisted"]
        Query["TanStack Query hooks"]
        Swap{{"apiClient.ts<br/>VITE_API_URL set?"}}
        Demo["demoClient.ts<br/>in-browser fixtures"]
    end

    subgraph Shell["Shells"]
        Web["Browser SPA"]
        Tauri["Tauri 2 window"]
    end

    subgraph Shared["packages/"]
        Schemas["@lifequest/schemas<br/>Zod contract"]
        ClientPkg["@lifequest/client<br/>typed fetch + ApiError"]
    end

    subgraph API["api/index.ts — one Vercel function"]
        Fastify["Fastify adapter<br/>global prefix /api"]
        Guard["SessionGuard<br/>Bearer token to session row"]
        Mods["7 feature modules<br/>Health · Auth · Users · Quests<br/>Rewards · Meetups · Content"]
    end

    subgraph Data["Data"]
        PG[("PostgreSQL<br/>Prisma 6 · 10 models")]
        LLM["OpenAI or HF Inference<br/>optional, key-gated"]
    end

    Web --> UI
    Tauri --> UI
    UI --> Zustand
    UI --> Query
    Query --> Swap
    Swap -- "unset" --> Demo
    Swap -- "set" --> ClientPkg
    ClientPkg --> Schemas
    ClientPkg --> Fastify
    Fastify --> Guard
    Guard --> Mods
    Mods --> Schemas
    Mods --> PG
    Mods -.-> LLM

    style Swap stroke:#F27954,stroke-width:2px
    style Guard stroke:#65BAE2,stroke-width:2px
    style PG stroke:#34D5B5,stroke-width:2px
    style LLM stroke:#F7BB3B,stroke-width:2px,stroke-dasharray: 4 4
```

### The one genuinely awkward design decision

The API is a full NestJS application, and NestJS dependency injection is built on `emitDecoratorMetadata`. Vercel's Node runtime bundles functions with esbuild, **which does not emit that metadata** — so importing `apps/api/src/app.module.ts` from the serverless entry produces a graph that compiles fine and then cannot resolve a single provider at runtime.

`api/index.ts` therefore imports `../apps/api/dist/app.module.js`: the output of `tsc -p tsconfig.build.json`, which does emit it. That pushes an ordering constraint up into `vercel.json`, whose `buildCommand` must build the shared packages, generate the Prisma client (with `binaryTargets` including `rhel-openssl-3.0.x` for Vercel's runtime), compile the API to `dist/`, build the System Card booklet, and only then build the SPA. The entry also caches the booted app in a module-scope promise so warm invocations skip the Nest bootstrap entirely, and nulls that promise on failure so a cold start can retry.

**Operational caveat, stated where it matters.** Because `app.init()` runs `PrismaService.onModuleInit()` → `$connect()`, *any* unreachable Postgres makes `bootstrap()` throw, and the catch in `api/index.ts` returns `500 {"error":"API failed to start"}` on **every** `/api/*` route — while the static SPA keeps serving `200`. The front end will look completely healthy. `GET /api/health` is the honest probe: unlike a static health route, it runs `SELECT 1` against the database on every request, so it fails when the database is gone.

### Data model

```mermaid
erDiagram
    User ||--o{ QuestProgress : tracks
    User ||--o{ Redemption : claims
    User ||--o{ Session : holds
    User ||--o{ RitualLog : logs
    Quest ||--o{ QuestProgress : instantiated_as
    Reward ||--o{ Redemption : redeemed_as

    User {
        uuid id PK
        string name
        string email UK
        string passwordHash
        enum audience "LAID_OFF RETIRED SHARED"
        int coins "spendable"
        int lifetimeCoins "cumulative, never decremented"
        string tier "column default EXPLORER, never written"
    }
    Quest {
        uuid id PK
        string title UK
        string description
        enum audience
        enum type "TASK COMMUNITY WELLNESS"
        int reward
    }
    QuestProgress {
        uuid id PK
        uuid userId FK
        uuid questId FK
        enum status "PENDING IN_PROGRESS COMPLETED"
        string notes "nullable, never written"
        datetime completedAt
    }
    Reward {
        uuid id PK
        string name UK
        string description
        int cost
    }
    Redemption {
        uuid id PK
        uuid userId FK
        uuid rewardId FK
        enum status "default COMPLETED, never transitioned"
        datetime createdAt
    }
    Session {
        uuid id PK
        uuid userId FK
        datetime expiresAt "now + 7 days"
    }
    RitualLog {
        uuid id PK
        uuid userId FK
        string name
        datetime createdAt
    }
    Meetup {
        uuid id PK
        string title UK
        string location
        datetime startsAt
        enum audience
        string rsvpUrl
    }
    ResumePrompt {
        uuid id PK
        string title UK
        string content
        string category
    }
    ContentGeneration {
        uuid id PK
        string key UK "quests | rewards"
        datetime lastGeneratedAt
    }
```

Ten models, four enums, four migrations under `apps/api/prisma/migrations/`. Three of the ten sit outside the route table, for three different reasons: **`ResumePrompt`** is seeded with two rows and has no controller, no service and no writer — pure scaffolding; **`Meetup`** has a route (`GET /api/meetups`) that no client calls; and **`ContentGeneration`** has no route by design, because it is bookkeeping the scheduler writes to itself to track when each catalogue was last regenerated.

Three columns are declared and never written after their default — `User.tier`, `QuestProgress.notes`, and `Redemption.status`. The tier a player sees is computed in the browser from `lifetimeCoins` (`apps/desktop/src/lib/tiers.ts`), not read from that column.

### REST surface

Global prefix `/api`. Nine of fourteen routes require a `Bearer` session token.

| Method   | Route                          | Guard   | Notes                                                              |
| -------- | ------------------------------ | ------- | ------------------------------------------------------------------ |
| `GET`    | `/api/health`                  | —       | runs `SELECT 1` against Postgres, so it fails when the DB is down  |
| `POST`   | `/api/auth/signup`             | —       | argon2 hash, 800 starting coins, quests bootstrapped by audience    |
| `POST`   | `/api/auth/login`              | —       | argon2 verify, issues a 7-day session row                           |
| `POST`   | `/api/auth/logout`             | Session | deletes the session row (204)                                       |
| `GET`    | `/api/users/me`                | Session | profile + quests + last 10 redemptions + today's rituals            |
| `PATCH`  | `/api/users/me`                | Session | name / email / audience; identity frozen for the demo account       |
| `POST`   | `/api/users/me/reset`          | Session | clears progress, rebases `coins` and `lifetimeCoins` to 1000        |
| `POST`   | `/api/users/me/rituals`        | Session | logs a named daily ritual (2–120 chars)                             |
| `GET`    | `/api/quests`                  | Session | the caller's progress, ordered by quest creation                    |
| `POST`   | `/api/quests/:questId/start`   | Session | `PENDING → IN_PROGRESS`; idempotent; 409 if already complete        |
| `POST`   | `/api/quests/:questId/complete`| Session | transactional: status + `coins` + `lifetimeCoins`                   |
| `GET`    | `/api/rewards`                 | —       | catalogue, cheapest first                                           |
| `POST`   | `/api/rewards/:rewardId/redeem`| Session | transactional spend; 400 on insufficient coins                      |
| `GET`    | `/api/meetups`                 | —       | audience-filtered; **no client consumes it**                        |

---

## Tech Stack

### Client (`apps/desktop`)

| Category       | Technologies                                        |
| -------------- | --------------------------------------------------- |
| **Framework**  | React 19.2, TypeScript 5.9, Vite 7.2                |
| **Shell**      | Tauri 2.9 (`@tauri-apps/api`, `plugin-store`), Rust 1.77.2 |
| **State**      | Zustand 5.0 (client, persisted), TanStack Query 5.90 (server) |
| **Routing**    | React Router 7.0                                    |
| **UI**         | Tailwind CSS 3.4, Radix Slot, CVA, Lucide + Phosphor icons |
| **Motion**     | Framer Motion 12.23, canvas-confetti 1.9            |
| **Forms**      | react-hook-form 7.66, Zod 4.1                       |

### API (`apps/api`)

| Category       | Technologies                                        |
| -------------- | --------------------------------------------------- |
| **Framework**  | NestJS 11.1 on Fastify 4.28, TypeScript 5.6         |
| **Data**       | Prisma 6 (`@prisma/client` 6.19), PostgreSQL 16 locally via Compose |
| **Auth**       | argon2 0.41, opaque Postgres session rows (no JWT)  |
| **Validation** | Zod 3.23 via `@lifequest/schemas`                   |
| **Logging**    | pino 9.4 / pino-pretty 13                           |

### Shared and tooling

| Category        | Technologies                                              |
| --------------- | --------------------------------------------------------- |
| **Contract**    | `@lifequest/schemas` (Zod), `@lifequest/client` (typed fetch + `ApiError`) |
| **Build**       | npm workspaces, `tsup` for packages, `tsc` for the API    |
| **Test**        | Vitest (schemas 2.1, API 4.0), Playwright 1.61            |
| **Lint**        | ESLint 9 flat config, Prettier 3                          |
| **System Card** | `booklet/` — Vite 6 + React 19, exported to PDF with Puppeteer 23 |
| **Hosting**     | Vercel (static SPA + one serverless function), Docker Compose locally |

> **Zod straddles two majors.** `apps/desktop` pins `zod ^4.1.12` while `packages/schemas` and `packages/client` pin `^3.23.8`. The client app only uses its own Zod through `react-hook-form` resolvers; every payload that crosses the API boundary is parsed by the v3 instance inside the shared packages. It works, but it is an inconsistency, not a design.

---

## Testing

**22 authored unit and contract cases run in CI, and 20 end-to-end specs do not.** All three counts are of test declarations in committed files, which you can reproduce without running anything:

| Suite                  | File                                          | Cases | Run by CI                       |
| ---------------------- | --------------------------------------------- | ----: | ------------------------------- |
| Schema contract        | `packages/schemas/src/index.test.ts`          |    16 | yes — `npm test -w packages/schemas` |
| API unit               | `apps/api/src/users/users.service.test.ts`    |     6 | yes — `npm run test:api`        |
| End-to-end (Playwright)| `apps/desktop/e2e/lifequest.spec.ts`          |    20 | **no**                          |

`.github/workflows/ci.yml` has exactly two jobs, `api` and `desktop`. The `api` job runs `npm ci`, builds the shared packages, lints, then runs both Vitest suites. The `desktop` job lints and builds the web bundle. Neither invokes Playwright, so the end-to-end suite is a local gate only.

**The `--passWithNoTests` story is worth telling, because it is the reason the counts are stated this precisely.** Until commit `04d4024` — *"test(api): the suite gate passed because it ran nothing, twice over"* — `apps/api`'s test script was `vitest --passWithNoTests` pointed at zero authored test files, so the CI step exited `0` having executed nothing. A green tick that asserts no behaviour is worse than a missing one, because it occupies the slot where evidence goes. The script is now plain `vitest run`, which exits `1` on "no test files found"; `.github/workflows/ci.yml` records the whole diagnosis in a comment above the step, so the non-zero-test assertion is enforced by the runner rather than by a sentence in a document.

What the two Vitest suites cover, and what they deliberately do not:

- **Schemas** were chosen first because they are pure, need no database or server, and break silently — a widened enum does not throw, it starts accepting data the rest of the system assumed it would never see. The load-bearing case is the `SHARED` audience asymmetry described above.
- **The API suite covers one invariant**, the demo-account identity freeze, exercised through a stub `PrismaService` rather than a database, because the freeze is a decision the service makes *before* it writes. Six cases, all against `UsersService`. The other seven domain services — `AuthService`, `SessionService`, `QuestsService`, `RewardsService`, `MeetupsService`, `AiContentService`, `ContentSchedulerService` — have **no unit test**.
- **The Playwright suite is the broad one**: 20 specs across two projects (desktop 1280×900 and a 375×812 mobile viewport), driving real Chromium over every screen and every interactive control, plus the two computed-colour audits. It is hermetic by default — Playwright builds the SPA, serves it with `vite preview`, and the app runs its in-browser demo client, so there is no network dependency. Point `E2E_BASE_URL` at a real deployment and the same specs exercise true Postgres persistence instead; the coin-durability assertion is gated on that flag.

```bash
npm test -w packages/schemas        # 16 contract cases
npm run test:api                    # 6 unit cases
npm run -w apps/desktop e2e:install # one-time: Playwright Chromium
npm run -w apps/desktop e2e         # 20 specs, desktop + mobile projects
```

**No coverage is measured and no coverage gate is set** — neither Vitest suite is configured with a coverage provider, and no workflow collects one. Stating a percentage here would mean inventing it. What can be said honestly is that **one of the eight domain services has any unit test at all**, and that the Playwright suite is where behavioural confidence actually comes from.

Supply-chain checks do run on every push: CodeQL (`javascript-typescript`, weekly plus per-push, results in the Security tab), full-history gitleaks secret scanning (`fetch-depth: 0`, because a shallow clone would scan one commit and report clean), and [OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/yadava5/lifequest). The Scorecard number is the one worth trusting most, because the OpenSSF computes and publishes it rather than this repository asserting it — and several of its 18 checks grade repository *settings* that no file here can turn on, so the score moving up over time is a better signal than wherever it starts.

---

## Implemented vs delegated vs planned

LifeQuest is, in its own landing page's words, *"a concept with a working prototype."* Being precise about which half of that sentence a given feature lives in is the point of this section.

### Implemented (hand-written in this repo)

- **The two-ledger coin economy** — `coins` / `lifetimeCoins` split, both incremented in one transaction on completion, only `coins` decremented on redemption, tier derived from lifetime. Migration `20260718000000_add_lifetime_coins` and the schema comment on the column both spell out why.
- **The full REST surface** — 14 routes, 7 feature modules, `SessionGuard` + `@CurrentUser` / `@CurrentSession` decorators, argon2 hashing, opaque 7-day session rows with server-side expiry and deletion.
- **The serverless entry** — `api/index.ts`, including the compiled-`dist` import constraint, the module-scope warm-start cache, and the retry-on-failure reset.
- **The shared contract** — `@lifequest/schemas` and `@lifequest/client`, including `ApiError` carrying the HTTP status so a 401 is distinguishable from a transient fault without matching on message substrings.
- **The zero-backend demo client** — `demoClient.ts` implements the identical `ApiClient` surface against in-memory fixtures, so the SPA is fully clickable with no API and upgrades to the real one by setting `VITE_API_URL`.
- **The landing page** — a playable hero mission card, a live tier-ladder demo of the no-demote invariant, and the dawn-expedition design system.
- **The System Card booklet** — `booklet/`, a standalone Vite + React app built to `/system-card` and exportable to PDF via Puppeteer.
- **The test suites and CI** — described above, including the deliberate removal of `--passWithNoTests`.

### Delegated (correctly, on purpose)

- **Password hashing** — `argon2`, not a hand-rolled KDF. There is no version of this that should be written here.
- **The ORM and migrations** — Prisma 6. Every multi-row write that has to be atomic (`completeQuest`, `redeem`, `resetProgress`, `syncQuestsForAudience`, content regeneration) is wrapped in `prisma.$transaction`; the isolation itself is Postgres's job.
- **The desktop shell** — Tauri 2 wraps the same web build. This project does not implement a native runtime; it configures one.
- **Content generation** — OpenAI or Hugging Face Inference produce the JSON. What *is* hand-written is the part that matters: the generated payload is parsed by a Zod schema with bounded reward costs before a single row is written, and rejected output is logged and dropped rather than persisted.
- **Session storage on the client** — `@tauri-apps/plugin-store` and `localStorage` via Zustand's persist middleware.

### Planned / not in this build

- **A released desktop binary.** `npm run tauri dev` runs the shell, and that is the whole of it. Nothing here builds, signs, notarizes or distributes an app: `tauri.conf.json` still carries the scaffold identifier `com.tauri.dev`, `src-tauri/Cargo.toml` still says `authors = ["you"]` with an empty licence and repository, `.vercelignore` excludes `src-tauri` from every deploy, and the CI `desktop` job runs `tsc && vite build` — the web bundle only. Treat "desktop app" as a working dev shell, not a shipped artifact.
- **Playwright in CI.** The 20 specs exist and are hermetic by design — `playwright.config.ts` builds and serves the SPA itself, so no backend is needed — yet no workflow runs them. Wiring that job up is the single highest-value change to this repository's evidence, because right now the broadest suite is the one nothing enforces.
- **A smoke test.** `apps/api/package.json` declares `"smoke": "tsx tests/smoke.ts"`, and `apps/api/tests/` is empty. The script has no target.
- **Unit tests for seven of the eight domain services.** Only `UsersService` has any; auth, sessions, quests, rewards, meetups, AI content and the content scheduler have none.
- **Background jobs.** `docker-compose.dev.yml` starts Redis; nothing connects to it. Neither `bullmq` nor `ioredis` is installed, and content regeneration is triggered lazily on request rather than scheduled.
- **Row-level security or any database-enforced tenancy.** Isolation today is entirely application-scoped: every guarded handler takes `userId` from `SessionGuard`, never from the payload. That is correct as far as it goes, and it is not the same guarantee Postgres policies would give.
- **Wiring up what is already modelled.** The `Meetup` route with no consumer, the `ResumePrompt` table with no route, and the `Redemption.status` / `QuestProgress.notes` / `User.tier` columns that nothing writes are all scaffolding for features that have not been built.
- **Removing dead code.** `apps/desktop/src/lib/tier.ts` exports a second, different tier ladder (`Explorer / Pathfinder / Adventurer / Trailblazer`) that **nothing imports**. The live ladder is `lib/tiers.ts`. If you are reading tier thresholds out of this repo, read `tiers.ts`.
- **`docs/architecture.md` is a plan, not a description.** It says so at the top and lists, row by row, which of its own claims are intent rather than current state (tRPC, BullMQ, Lucia, Turborepo, OpenTelemetry, Sentry — none installed). Read it as a design record.

---

## Getting Started

### Prerequisites

- **Node.js 20+** — the version CI pins in `.github/workflows/ci.yml`
- **npm 11+** — the root `package.json` sets `"packageManager": "npm@11.6.0"`
- **Docker** — for the local Postgres (and the Redis container, which nothing currently uses)
- **Rust toolchain** (`rustup`, 1.77.2+) — only if you want the native Tauri shell

### Quick start

```bash
git clone https://github.com/yadava5/lifequest.git
cd lifequest

# Install every workspace from the lockfile
npm ci

# Build the shared contract packages first — the API and client both import them
npm run build:packages

# Postgres on :5432
docker compose -f docker-compose.dev.yml up -d

# Schema + demo data
cp apps/api/.env.example apps/api/.env
npm run -w apps/api prisma:push
npm run -w apps/api prisma:seed

# Two terminals
npm run dev:api        # NestJS on http://localhost:4000/api
npm run dev:desktop    # Vite on   http://localhost:5173
```

`npm run dev` at the root is an alias for `dev:desktop` — it starts the client only. Without `VITE_API_URL` the client runs its in-browser demo fixtures; point it at the API to use the real one.

The seed creates `demo@lifequest.app` / `LifeQuest123!`.

For the native window instead of the browser:

```bash
cd apps/desktop && npm run tauri dev
```

### Environment variables

Only these are read by application code. Everything is optional except `DATABASE_URL` in a real deployment.

| Variable                            | Read by                              | Default / notes                                                     |
| ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| `DATABASE_URL`                      | `config/database.config.ts`, Prisma  | falls back to `postgresql://lifequest:lifequest@localhost:5432/lifequest` |
| `PORT`                              | `config/app.config.ts`               | `4000`                                                              |
| `CORS_ORIGIN`                       | `main.ts`, `api/index.ts`            | `*`; may be a comma-separated allowlist. Credentials are always off — Bearer auth carries no cookies |
| `DEMO_EMAIL`                        | `users/users.service.ts`             | `demo@lifequest.app`; the account whose identity is frozen          |
| `VITE_API_URL`                      | `apps/desktop/src/lib/apiClient.ts`  | unset ⇒ in-browser demo client. Production inlines `/api`           |
| `OPENAI_API_KEY` · `OPENAI_MODEL` · `OPENAI_MAX_TOKENS` | `content/ai-content.service.ts` | unset ⇒ AI generation is skipped entirely. Model defaults to `gpt-4o-mini`, 600 tokens |
| `HF_API_TOKEN` · `HF_MODEL`         | `content/ai-content.service.ts`      | fallback provider; model defaults to `mistralai/Mistral-7B-Instruct` |
| `E2E_BASE_URL` · `E2E_PORT`         | `apps/desktop/playwright.config.ts`  | point the suite at a live deployment instead of a local preview     |

`apps/api/.env.example` carries `DATABASE_URL`, `PORT` and `NODE_ENV`. `DIRECT_URL` appears in the deployment docs but is not read by anything — the Prisma datasource declares only `url`, and the documented migration command simply runs `DATABASE_URL="$DIRECT_URL" prisma migrate deploy` so DDL bypasses the connection pooler.

### Scripts

| Command                              | What it does                                                    |
| ------------------------------------ | --------------------------------------------------------------- |
| `npm run dev:api`                     | NestJS with nodemon hot reload on `:4000`                       |
| `npm run dev:desktop`                 | Vite dev server on `:5173`                                      |
| `npm run build:packages`              | Build `@lifequest/schemas` then `@lifequest/client` (tsup)      |
| `npm run build:api`                   | `tsc -p tsconfig.build.json` → `apps/api/dist`                   |
| `npm run build:desktop`               | `tsc && vite build` → `apps/desktop/dist`                        |
| `npm run build:system-card`           | Build `booklet/` into `apps/desktop/public/system-card`          |
| `npm run lint:api` · `lint:desktop`   | ESLint over each app                                            |
| `npm test -w packages/schemas`        | 16 contract cases                                               |
| `npm run test:api`                    | 6 unit cases                                                    |
| `npm run -w apps/desktop e2e`         | 20 Playwright specs, desktop + mobile                           |
| `npm run -w apps/api prisma:push`     | Sync the schema without a migration (local only)                |
| `npm run -w apps/api prisma:migrate`  | `prisma migrate deploy` — the deployment path                   |
| `npm run -w apps/api prisma:seed`     | Demo user, 3 quests, 3 rewards, 3 meetups, 2 résumé prompts     |

---

## Project Structure

```
lifequest/
├── api/
│   └── index.ts              # Vercel entry: boots Nest once, re-emits requests
│                             # into Fastify. Imports apps/api/dist, NEVER src.
├── apps/
│   ├── api/                  # NestJS 11 + Fastify
│   │   ├── prisma/
│   │   │   ├── schema.prisma # 10 models, 4 enums
│   │   │   ├── migrations/   # 4 migrations
│   │   │   └── seed.ts       # demo user + starter catalogue
│   │   ├── src/
│   │   │   ├── auth/         # argon2 + opaque session rows (no JWT)
│   │   │   ├── common/       # SessionGuard, @CurrentUser, @CurrentSession
│   │   │   ├── content/      # key-gated AI regeneration + staleness scheduler
│   │   │   ├── users/        # profile, reset, rituals, demo identity freeze
│   │   │   ├── quests/  rewards/  meetups/  health/
│   │   │   └── database/     # PrismaService (connects in onModuleInit)
│   │   ├── tests/            # EMPTY — the `smoke` script has no target
│   │   └── DEPLOY.md         # serverless runbook
│   │
│   └── desktop/              # React 19 + Vite 7, web and Tauri
│       ├── e2e/              # 20 Playwright specs (not run by CI)
│       ├── src/
│       │   ├── features/landing/  # the playable landing page
│       │   ├── screens/      # Mission Control, Quests, Rewards, Guild, Settings
│       │   ├── lib/          # apiClient (env swap), demoClient, tiers
│       │   └── store/        # Zustand, persisted to localStorage
│       └── src-tauri/        # Rust shell. Excluded from every Vercel deploy.
│
├── packages/
│   ├── schemas/              # Zod contract — the only place types are defined
│   └── client/               # typed fetch helpers + ApiError(status)
│
├── booklet/                  # System Card: Vite + React, → /system-card, → PDF
├── docs/                     # development, deployment, architecture (a PLAN), legacy
├── legacy/                   # superseded first-gen prototype — see below
└── vercel.json               # one project: static SPA + one function
```

### About `legacy/`

`legacy/` is the **superseded first-generation prototype** — Create React App plus an Express API on Prisma/SQLite plus an Electron shell — kept for reference and parity checks only. It is not built, not deployed, not linted, not tested by CI, and excluded from every Vercel upload by `.vercelignore`. Nothing in `apps/` or `packages/` imports it. Features described in `legacy/README.md` are the prototype's, not this app's; the current stack is Tauri, NestJS and Postgres. See [`docs/legacy.md`](docs/legacy.md).

---

## Technical Decisions

**Opaque session rows instead of JWTs.** Sessions are UUID primary keys in a `Session` table with a 7-day TTL, sent as a `Bearer` token. The tradeoff is a database read on every guarded request — real cost, and the reason `SessionGuard` does exactly one `findUnique`. What it buys is revocation that actually works: `logout` deletes the row and the token is dead immediately, with no blocklist and no refresh-rotation machinery. For a single-region app with fourteen routes, that is the cheaper correctness. It also means there is no `JWT_SECRET`, despite two documents still mentioning one.

**Two coin columns instead of deriving lifetime from history.** The alternative is summing completed `QuestProgress` rewards on read, which is normalized and needs no migration. It was rejected because tier is displayed on every screen, the sum would run on every profile fetch, and it silently breaks the moment a quest's reward value is edited or a quest is deleted — which `ContentSchedulerService` does wholesale when AI regeneration fires. A denormalized `lifetimeCoins` that only ever increments is immune to catalogue churn. The cost is that the invariant `lifetimeCoins >= coins` is now maintained by application code at every write site rather than by the schema — and there is currently one place it is violated: `apps/api/prisma/seed.ts` creates the demo user with `coins: 1000` and no `lifetimeCoins`, so the column takes its `0` default and the seeded account reads as `EXPLORER` despite a 1,000-coin balance that would otherwise place it at `ADVENTURER`. The signup, completion and reset paths all set both.

**A demo client that impersonates the API, rather than a mock server.** `demoClient.ts` implements `ApiClient` structurally, so `apiClient.ts` swaps implementations on one environment variable with no branching anywhere else in the app. That makes the SPA fully explorable with no backend, and it makes the Playwright suite hermetic and deterministic by default. The honest cost: 210 lines of fixtures that duplicate seeded server behaviour and can drift from it, and a demo path where a reload re-seeds by design. The e2e suite guards the seam by gating its durability assertion on `E2E_BASE_URL`, so the persistence claim is only asserted where persistence actually exists.

---

## Verify it

Every number above terminates in something you can open.

```bash
# 14 routes across the controllers
grep -rE "@(Get|Post|Patch|Put|Delete)\(" apps/api/src --include='*.controller.ts' | wc -l

# 9 of them guarded
grep -r "@UseGuards(SessionGuard)" apps/api/src --include='*.controller.ts' | wc -l

# 16 / 6 / 20 test cases
grep -cE "^\s+it\("  packages/schemas/src/index.test.ts
grep -cE "^\s+it\("  apps/api/src/users/users.service.test.ts
grep -cE "^\s+test\(" apps/desktop/e2e/lifequest.spec.ts

# 10 Prisma models
grep -c "^model " apps/api/prisma/schema.prisma

# The claims that are absences. Each should return only the definition site,
# or nothing at all: the dead tier ladder has no importer, no client method
# calls the meetups endpoint, and no JWT exists anywhere.
grep -rn "resolveTierHint" apps/desktop/src packages/*/src
grep -rni "meetup" packages/client/src
grep -rni "jwt" apps/api/src apps/desktop/src packages/*/src api/index.ts
```

- **What CI actually runs** is `.github/workflows/ci.yml` — two jobs, and neither one is Playwright.
- **The health route really queries** — `apps/api/src/health/health.controller.ts` runs `SELECT 1`. `curl https://getlifequest.vercel.app/api/health` returns `{"status":"ok","timestamp":…}` when Postgres is reachable and a `500 {"error":"API failed to start"}` when it is not.
- **The supply-chain score is not self-reported** — [OpenSSF Scorecard](https://scorecard.dev/viewer/?uri=github.com/yadava5/lifequest) is computed and published by the OpenSSF, and anyone can re-run it.
- **The System Card** at [getlifequest.vercel.app/system-card](https://getlifequest.vercel.app/system-card) cites file and line for each of its own claims; `booklet/src/content.ts` records where it deliberately prints the honest version over the flattering one.

---

## Documentation

- [`docs/README.md`](docs/README.md) — documentation index
- [`docs/development.md`](docs/development.md) — local setup and workflows
- [`docs/architecture.md`](docs/architecture.md) — the rebuild **plan**, with its own banner listing which rows are intent rather than current state
- [`docs/deployment.md`](docs/deployment.md) — deploying to Vercel
- [`apps/api/DEPLOY.md`](apps/api/DEPLOY.md) — the serverless runbook, including the compiled-`dist` constraint
- [`docs/legacy.md`](docs/legacy.md) — the superseded prototype
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — branching and PR expectations

---

## Author

**Ayush Yadav** — sole author and maintainer.
[github.com/yadava5](https://github.com/yadava5)

---

## License

Released under the [MIT License](LICENSE). Copyright © 2025 Ayush Yadav.

---

<p align="center">
  Built with Tauri, React, NestJS, and PostgreSQL · <a href="https://getlifequest.vercel.app">getlifequest.vercel.app</a>
</p>
