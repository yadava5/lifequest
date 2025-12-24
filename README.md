# LifeQuest

LifeQuest is a full-stack prototype for a geolocation quest platform that helps recently laid-off professionals and retirees rebuild routines, social ties, and motivation through real-world missions and tangible rewards.

## Repository Layout

```
lifequest/
├── backend/            # Express + Prisma API (SQLite persistence, Docker-ready)
├── public/             # CRA static assets
├── src/                # React application source
│   ├── app/            # Top-level App shell (layout, routing, providers)
│   ├── features/       # Domain-specific state & logic (quests, rewards, etc.)
│   ├── lib/            # API client helpers
│   ├── pages/          # Route-level screens
│   ├── components/     # Re-usable UI primitives
│   ├── styles/         # Global CSS variables/resets
│   └── tests/          # React Testing Library specs
└── docker-compose.yml  # Compose definition for the API container
```

## Getting Started

### Prerequisites

- **Node.js 20 LTS** (front-end dev server)
- **npm 10+**
- **Docker Desktop** (for running the backend container)

### 1. Install front-end dependencies

```bash
npm install
```

### 2. Start the API (choose one)

#### Option A: Docker (recommended)

```bash
# Build & run the API container
docker compose up --build api
```

What happens on first run:
- Installs backend dependencies
- Pushes the Prisma schema to an SQLite database inside the container (mounted under the `backend_data` volume)
- Seeds demo data (demo user, quests, rewards, meetups)
- Serves the API on `http://localhost:4000`

To stop the container:

```bash
docker compose down
```

#### Option B: Local Node process

```bash
cd backend
cp .env.example .env   # optional – adjust DATABASE_URL/PORT as needed
npm install            # installs backend deps (needs network access)
npx prisma db push
npx prisma db seed
npm run dev            # starts the API with hot reload on http://localhost:4000
```

> **Tip:** The default demo account has the id `demo-user` and comes preloaded with quests and 1,000 Quest Coins.

### 3. Run the React app

Back at the repository root:

```bash
npm start
```

CRA proxies API requests to `http://localhost:4000` (see the `proxy` entry in `package.json`). Log in as the seeded demo user automatically; all quest, reward, resume, and community data flows from the API.

### 4. Tests

```bash
CI=true npm test -- --watch=false
```

> _Note:_ Jest tests mock the API responses; no backend required during test execution.

## API Overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/health` | GET | Service heartbeat |
| `/api/users/:id` | GET | Fetch user profile, quest progress, recent redemptions |
| `/api/users` | POST | Create a new player (auto-enrols relevant quests) |
| `/api/users/:id/reset` | POST | Reset quest progress and coin balance |
| `/api/quests?userId=:id` | GET | List quest progress for a user |
| `/api/quests/:questId/complete` | POST | Mark quest complete, award coins |
| `/api/rewards` | GET | Reward catalogue |
| `/api/rewards/:rewardId/redeem` | POST | Redeem a reward and deduct coins |
| `/api/meetups?audience=LAID_OFF|RETIRED|SHARED` | GET | Upcoming meetups filtered by audience |

## Front-end Experience Highlights

- Mobile-first shell with MUI navigation, contextual coin balance, and distinct screens for Home, Quest Log, Resume Boost, Community, and Rewards.
- Quest state is hydrated from the API and cached in context; actions immediately sync coins, completions, and redemption history.
- Resume Boost stage now provides curated prompts and best practices while the AI integration is under construction.
- Community screen pulls meetups from the API based on the player’s audience and surfaces recent reward redemptions as shareable stories.
- Rewards store reflects live affordability, enforces coin deductions via the API, and celebrates successful redemptions.

## Next Steps

- Integrate a real geolocation service (Mapbox/Google Maps) for quest discovery.
- Reintroduce AI-powered resume analysis once service selection and privacy requirements are finalised.
- Add authentication & multi-user management (currently relies on the seeded demo user).
- Extend API test coverage (Jest + Supertest) and consider contract tests between web and API.
- Automate Docker image builds and include infrastructure-as-code for deployment environments.

Enjoy exploring LifeQuest!
