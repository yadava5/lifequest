# Development

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for Postgres + Redis)
- Rust toolchain for Tauri (`rustup`) and platform build tools

## Install dependencies

### npm workspaces (recommended)

```bash
npm install
```

### npm per package

```bash
cd packages/schemas && npm install
cd ../client && npm install
cd ../../apps/api && npm install
cd ../desktop && npm install
```

## Start data services

```bash
docker compose -f docker-compose.dev.yml up -d
```

## Build shared packages

The API and desktop app consume `@lifequest/schemas` and `@lifequest/client` from `packages/`.

```bash
cd packages/schemas
npm run build
cd ../client
npm run build
```

## Run the API

```bash
cd apps/api
cp .env.example .env
npm run prisma:push
npm run prisma:seed
npm run dev
```

API defaults to `http://localhost:4000`.

## Run the desktop app

```bash
cd apps/desktop
npm run dev
```

For the native shell:

```bash
npm run tauri dev
```

Vite defaults to `http://localhost:5173`.

## Tests

```bash
cd apps/api
npm run test
```

```bash
cd apps/desktop
npm run lint
```
