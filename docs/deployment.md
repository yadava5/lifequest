# Deployment

This repo ships the API and desktop web build to managed hosting without changing local workflows.

## Option: Render (API) + Vercel (web)

### 1) Render API (Postgres)

1. Create a Render account and connect GitHub.
2. In Render, choose **Blueprint** and point it at this repo (it will read `render.yaml`).
3. After the service is created, set `CORS_ORIGIN` to your Vercel domain.
4. Optional: add `HF_API_TOKEN` if you want AI content generation.

The API will be available at:

```
https://<your-render-service>.onrender.com/api
```

### 2) Vercel web build (desktop UI)

1. Create a Vercel project and import this repo.
2. Set the environment variable:

```
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

3. Deploy. Vercel uses `vercel.json` in the repo root.

The web UI will be available at:

```
https://<your-vercel-project>.vercel.app
```

## Local workflow (unchanged)

These deploy configs do not change local development commands:

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
