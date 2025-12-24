# Legacy prototype

The legacy prototype is a Create React App + Express + Electron stack preserved under `legacy/`.

## Contents

```
legacy/
├── backend/          # Express + Prisma (SQLite)
├── public/           # CRA static assets
├── src/              # CRA source
├── electron/         # Electron main + preload
├── scripts/          # Dev orchestration scripts
└── playwright/       # E2E tests
```

## Run the legacy web + API

```bash
cd legacy
npm install
npm run dev
```

This runs the Express API and CRA frontend together.

## Run the legacy desktop app (Electron)

```bash
cd legacy
npm run desktop
```

## Legacy API (optional)

```bash
cd legacy/backend
cp .env.example .env
npm install
npm run prisma:push
npm run prisma:seed
npm run dev
```
