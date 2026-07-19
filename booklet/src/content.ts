/**
 * LifeQuest System Card — copy + verified data (self-contained).
 *
 * Every number here is verified against the lifequest repo (branch main) and
 * carries a SOURCE note where it is a measured / enforced fact. Nothing is
 * invented. Four deliberate honesty calls, all grounded in the code rather
 * than a marketing line:
 *
 *   · TIER LADDER — the booklet prints the ACTIVE ladder imported by the app
 *     (lib/tiers.ts: EXPLORER · ADVENTURER · TRAILBLAZER · LUMINARY). A second,
 *     dead lib/tier.ts ("Pathfinder") has no importer; the landing card's
 *     "to Pathfinder" label reads from that stale file, so we don't reproduce it.
 *
 *   · CO-TENANT POSTGRES — `?schema=lifequest` is the DOCUMENTED deploy recipe
 *     for isolating LifeQuest's tables inside a shared Supabase
 *     (apps/api/DEPLOY.md:22). The committed local default connects to a
 *     database named `lifequest`; the datasource declares no schema. We print
 *     it as the co-tenancy pattern it is, not as a wired default.
 *
 *   · DEMO INTEGRITY — the server-side demo protection is an IDENTITY FREEZE
 *     (name + email are immutable for the shared demo account,
 *     users.service.ts:47-59), not a blanket read-only lock; gameplay stays
 *     fully playable. We describe it exactly.
 *
 *   · PERSISTENCE — printed as DOCUMENTED (README.md:11 states persisted
 *     quests/coins/redemptions + an independent live audit, 2026-07) and shown
 *     as CODE (transactional Prisma writes). Honest seam: the public URL ships
 *     in demo mode — in-browser fixtures that re-seed on reload
 *     (DEPLOY.md:3, demoClient.ts:90); durable persistence engages when the SPA
 *     is pointed at the live API (apiClient.ts:14). Documented, not re-benchmarked.
 */

import type { SectionKey } from "./theme";

// ---------------------------------------------------------------------------
// Brand / masthead
// ---------------------------------------------------------------------------

export const BRAND = {
  name: "LifeQuest",
  subtitle: "Routines are boring — missions aren’t.",
  author: "Ayush Yadav",
  year: "2026",
  liveUrl: "lifequest-sigma-fawn.vercel.app",
  qrTarget: "https://lifequest-sigma-fawn.vercel.app",
} as const;

export const MASTHEAD = {
  volume: "Vol. 01 · System Card",
  kicker:
    "A routine tracker that plays like a game — missions, coins, tiers, and a guild, on a real full-stack backend.",
  colophonLines: [
    "© 2026 · Ayush Yadav",
    "Tauri + React · NestJS + Fastify + Prisma",
    "Live on Vercel · MIT",
  ],
} as const;

// ---------------------------------------------------------------------------
// Welcome / endpaper — ≤ 80 words.
// ---------------------------------------------------------------------------

export const ABSTRACT = {
  greeting: "Welcome.",
  body:
    "Looking for work is a demoralizing, isolating grind — and the days you most need momentum are the ones it leaks away. LifeQuest is a concept for fixing that: it turns the daily search — applications, follow-ups, upskilling, and rest — into missions that pay you back, so people keep going without burning out. Finish a quest and the page pays out — confetti, coins, a tier that climbs. This System Card is the pitch and the proof: a warm idea, and a working prototype on a real full-stack backend.",
} as const;

// ---------------------------------------------------------------------------
// Chapter TOC
// ---------------------------------------------------------------------------

export const CHAPTERS = [
  { num: "01", name: "WHY", pages: "04 – 07", sectionKey: "01_WHY" as const },
  { num: "02", name: "HOW", pages: "08 – 13", sectionKey: "02_HOW" as const },
  { num: "03", name: "INSIDE", pages: "14 – 17", sectionKey: "03_INSIDE" as const },
  { num: "04", name: "PROOF", pages: "18 – 22", sectionKey: "04_PROOF" as const },
  { num: "05", name: "BUILD", pages: "23 – 27", sectionKey: "05_BUILD" as const },
] as const;

export const TOC = {
  chapterTaglines: {
    WHY: "the job search is a lonely climb",
    HOW: "missions → coins → tiers → a guild",
    INSIDE: "serverless Nest · a monotonic ledger",
    PROOF: "it persists — and it’s zero-purple",
    BUILD: "a concept · and a working prototype",
  } as Record<string, string>,
  chapterGlyphs: {
    WHY: "◔",
    HOW: "✦",
    INSIDE: "◈",
    PROOF: "◎",
    BUILD: "▲",
  } as Record<string, string>,
  audience: [
    { key: "Job-seekers", val: "the long search — momentum, rebuilt one win." },
    { key: "Adopters", val: "nonprofits, campuses, libraries who could carry it." },
    { key: "Engineers", val: "the serverless Nest graph and the coin ledger." },
  ],
  readingPaths: [
    { key: "Skim · 5 min", val: "the loop, the ladder, the receipts." },
    { key: "Deep · 20 min", val: "cover to cover — built for one sitting." },
    { key: "Play along", val: "open the live demo; complete the hero card." },
  ],
  atAGlance: [
    { key: "4 tiers", val: "Explorer → Luminary, from lifetime coins." },
    { key: "monotonic", val: "redeeming a reward can’t demote you." },
    { key: "0 purple", val: "coral · honey · aqua · sky, by rule." },
  ],
  glossary: [
    { term: "Quest", def: "a real routine, framed as a mission." },
    { term: "Coin", def: "earned on completion; spent in the vault." },
    { term: "Tier", def: "rank derived from lifetime coins." },
    { term: "lifetimeCoins", def: "cumulative earned — only ever grows." },
    { term: "Guild", def: "the community layer — meetups + wins." },
    { term: "Serverless", def: "the API is one Vercel function." },
  ],
  colophon: ["© 2026 · Ayush Yadav", "LifeQuest · System Card Vol. 01", "Licensed MIT"],
  teaser:
    "A printed pitch for a concept that helps job-seekers keep momentum — the why, the loop, and the working prototype. Read it with the live demo open.",
} as const;

// ---------------------------------------------------------------------------
// Shared data — the four tiers (active ladder), demo quests + rewards.
// ---------------------------------------------------------------------------

/** Active tier ladder. source · apps/desktop/src/lib/tiers.ts:14-17 */
export const TIERS = [
  { name: "EXPLORER", at: 0, blurb: "Every journey starts with a single step." },
  { name: "ADVENTURER", at: 500, blurb: "Momentum is yours. Keep the streak alive." },
  { name: "TRAILBLAZER", at: 1800, blurb: "You lead where others follow." },
  { name: "LUMINARY", at: 4000, blurb: "A beacon for the whole guild." },
] as const;

/** Seeded demo quests. source · apps/desktop/src/lib/demoClient.ts:40-81 */
export const DEMO_QUESTS = [
  { title: "Reconnect with a mentor", type: "COMMUNITY", reward: 80 },
  { title: "Send three applications", type: "TASK", reward: 120 },
  { title: "Take a real break", type: "WELLNESS", reward: 40 },
  { title: "Attend a networking event", type: "COMMUNITY", reward: 100 },
  { title: "Thirty minutes of upskilling", type: "TASK", reward: 30 },
] as const;

/** Seeded demo reward vault. source · apps/desktop/src/lib/demoClient.ts:83-88 */
export const DEMO_REWARDS = [
  { name: "Co-working day pass", cost: 200 },
  { name: "Coffee-chat credits", cost: 150 },
  { name: "Wellness stipend", cost: 350 },
  { name: "Skill course voucher", cost: 500 },
] as const;

// ---------------------------------------------------------------------------
// Section 01 — WHY
// ---------------------------------------------------------------------------

export const WHY = {
  divider: { subtitle: "the daily job search is a demoralizing climb, taken alone" },

  reentry: {
    eyebrow: "§01 · THE GRIND",
    headline: "The job search is a lonely climb.",
    pullQuote:
      "The search is hardest exactly when momentum matters most — and the easiest stretch to spend entirely alone.",
    body: [
      "LifeQuest is a concept for the people worn down by a long job search — the ones whose momentum leaks away between rejections, until they burn out or quietly give up. It gamifies the daily search: applications, follow-ups, upskilling, and rest, each framed as a mission that pays back.",
      "The app tags every quest by audience — the schema ships LAID_OFF, RETIRED, and SHARED — so the same engine carries a laid-off professional or anyone rebuilding a daily routine. A guild sits behind them so no one climbs alone.",
    ],
    coda:
      "The goal was never another to-do list. It was a reason to take the next step — and someone to notice you took it.",
    audiences: [
      { label: "LAID_OFF", quote: "the layoff search — momentum, one application at a time." },
      { label: "RETIRED", quote: "an encore search, minus the grind." },
      { label: "SHARED", quote: "any daily routine, tagged for either." },
    ],
    source: "source · README.md:5 · apps/api/prisma/schema.prisma:127-131 (enum Audience)",
  },

  chore: {
    eyebrow: "§01 · THE FEELING",
    headline: "Routines are boring. Missions aren’t.",
    lede:
      "A checklist is a debt you owe yourself. The same task, framed as a mission with a reward on the other side, is something you get to do.",
    beforeTitle: "A ROUTINE",
    withTitle: "A MISSION",
    before: [
      "A flat list you update out of guilt.",
      "Finishing changes nothing you can feel.",
      "No streak, no stakes, no witness.",
      "“Take a walk” sits there, unloved.",
      "Momentum leaks out between the lines.",
    ],
    with: [
      "A card with a coin value and a type.",
      "Completing it pays out — coins + confetti.",
      "A tier bar nudges up; a guild sees it.",
      "“Take the long way home” — a 30-min walk, +60.",
      "The loop is designed to make you go again.",
    ],
    gate:
      "The task did not change. The framing did — and framing is the whole product.",
    source: "source · LandingScreen.tsx:212-213, 133-134 (“Missions, not chores”)",
  },

  loop: {
    eyebrow: "§01 · THE REFRAME",
    headline: "Momentum needs a loop.",
    body: [
      "Reframe the tracker. A list is open-loop: you put things in and nothing comes back. A game is closed-loop: every action returns a reward, a number, a rank — a reason to take the next one.",
      "LifeQuest wraps a real routine in that loop. Earn coins, climb tiers, and rebuild momentum one small win at a time — then spend the coins on something real and start again.",
    ],
    thesis: "If completing a routine pays you back, you never have to force the next one.",
    reframe: [
      { from: "a routine", to: "a mission" },
      { from: "a streak", to: "coins + a tier" },
      { from: "doing it alone", to: "a guild at your back" },
    ],
    handoff: "So: what does that loop actually look like? Turn the page.",
    source: "source · LandingScreen.tsx:222-224 · STEPS 154-158",
  },
} as const;

// ---------------------------------------------------------------------------
// Section 02 — HOW
// ---------------------------------------------------------------------------

export const HOW = {
  divider: { subtitle: "a routine becomes a mission · a coin · a tier · a guild" },

  loop: {
    eyebrow: "§02 · THE LOOP",
    headline: "Pick it. Log it. Claim it.",
    lede:
      "The whole game is one three-beat loop, tuned so the payoff lands the instant you finish — then points you at the next mission.",
    steps: [
      { n: "01", label: "Pick a mission", detail: "Task · Community · Wellness — tuned to the search.", accentKey: "02_HOW" },
      { n: "02", label: "Log the win", detail: "Complete it — coins land, confetti fires.", accentKey: "04_PROOF" },
      { n: "03", label: "Claim the reward", detail: "Trade momentum for something real. Then again.", accentKey: "03_INSIDE" },
    ],
    orderNote:
      "Exact order in the live app: the server awards coins first (the mutation resolves), then confetti fires, then a refetch ticks your tier up — so the celebration only ever follows a real write.",
    source: "source · LandingScreen.tsx:154-158 · QuestsScreen.tsx:39-44 · lib/celebrate.ts",
  },

  mission: {
    eyebrow: "§02 · THE MISSION",
    headline: "A routine, wearing a quest.",
    body: [
      "A mission is just a routine with three things bolted on: a type, a coin reward, and a Complete button. That is enough to turn a chore into a card you want to clear.",
      "Quests come in three lines — TASK, COMMUNITY, WELLNESS — so a day balances shipping something, seeing someone, and looking after yourself.",
    ],
    // Illustrative card mirrors the app's live hero mission.
    card: {
      type: "WELLNESS · DAILY",
      title: "Take the long way home — a 30-minute walk",
      desc: "No podcast, no phone. Just the walk.",
      reward: "+60",
    },
    types: [
      { k: "TASK", v: "ship something small and concrete." },
      { k: "COMMUNITY", v: "reach one person; show up once." },
      { k: "WELLNESS", v: "move, rest, reflect — no output." },
    ],
    source: "source · LandingScreen.tsx:83-84 · schema.prisma:133-137 (enum QuestType)",
  },

  coins: {
    eyebrow: "§02 · THE ECONOMY",
    headline: "Coins you can actually spend.",
    body: [
      "Every quest carries a coin reward — 30 to 120 in the seeded set. A new account starts with 800 coins in the bank, so the vault feels reachable from day one.",
      "The vault is stocked with real-world boosts, not badges: a co-working pass, coffee-chat credits, a wellness stipend, a course voucher. Coins are a currency, so spending them has to cost something.",
    ],
    startBonus: { value: "800", label: "coins granted at signup" },
    vaultNote: "The reward vault — spend hard-won coins on something real.",
    source: "source · demoClient.ts:40-88 (quests + vault) · auth.service.ts:28-29 (start 800)",
  },

  tiers: {
    eyebrow: "§02 · THE LADDER",
    headline: "Four tiers, earned for good.",
    lede:
      "Rank is not a level you buy — it is a reflection of everything you have ever earned. Four rungs, each with a threshold in lifetime coins.",
    note:
      "Tier reads lifetimeCoins, never your spendable balance — which is the whole reason a redemption can’t knock you back down a rung.",
    source: "source · apps/desktop/src/lib/tiers.ts:14-20 (TIERS + tierProgress)",
  },

  guild: {
    eyebrow: "§02 · THE GUILD",
    headline: "No one levels up alone.",
    body: [
      "The loneliest part of a job search is the fix the game takes most seriously. A guild tab sits alongside the quest log — meetups to show up to, and shared wins from people in the same climb.",
      "It is the community surface, not a leaderboard: the top tier’s blurb is literally “a beacon for the whole guild.” You climb for yourself, but never by yourself.",
    ],
    facts: [
      { k: "THE TAB", v: "“Guild” in the primary nav → /community" },
      { k: "MEETUPS", v: "local events, tagged by audience, with RSVPs" },
      { k: "SHARED", v: "wins and redemptions others can see" },
      { k: "THE PITCH", v: "“no one levels up alone”" },
    ],
    honest:
      "Honest framing: the guild is the community layer (meetups + shared wins), surfaced under one tab — not a separate group entity in the schema.",
    source: "source · LandingScreen.tsx:147-148 · AppLayout.tsx:27 · schema.prisma:76-86 (Meetup)",
  },
} as const;

// ---------------------------------------------------------------------------
// Section 03 — INSIDE
// ---------------------------------------------------------------------------

export const INSIDE = {
  divider: { subtitle: "serverless NestJS, argon2 accounts, and a ledger that only climbs" },

  architecture: {
    eyebrow: "§03 · THE ENGINE",
    headline: "One function, the whole backend.",
    body:
      "The API is a NestJS + Fastify application that boots once at module scope and is reused across warm invocations — the entire graph served from a single Vercel function. A request flows: browser → the function → Nest routes it into Fastify → services touch Postgres through Prisma → back out under the /api prefix.",
    flow: [
      { stage: "SPA", detail: "Tauri + React client" },
      { stage: "Vercel fn", detail: "one serverless handler" },
      { stage: "Nest + Fastify", detail: "DI graph, /api prefix" },
      { stage: "Prisma", detail: "typed queries + tx" },
      { stage: "Postgres", detail: "the durable store" },
    ],
    proven: [
      "the Nest+Fastify graph boots from the tsc-compiled dist/ (DI metadata that esbuild drops)",
      "Prisma connects to Supabase and SELECT 1 succeeds; the rhel serverless binary is prebuilt",
      "CORS is Bearer-only — no cookies, no wildcard-with-credentials",
    ],
    source: "source · api/index.ts:10-39 · vercel.json (functions) · apps/api/DEPLOY.md:8-15",
  },

  monotonic: {
    eyebrow: "§03 · THE RATCHET",
    headline: "Spending never sets you back.",
    lede:
      "The design’s quiet crown jewel: your rank is a pure function of a number that only ever increases. Redeeming a reward is a real cost — but it can’t undo your climb.",
    body:
      "Two counters live on every user. `coins` is your spendable balance: it goes up when you complete a quest and down when you redeem. `lifetimeCoins` is cumulative earned: it goes up on completion and is never touched on redemption. Tier progress reads lifetimeCoins — so the ladder is monotonic by construction.",
    up: { field: "lifetimeCoins", label: "earned · only climbs", note: "quest complete → +reward; redeem → untouched" },
    down: { field: "coins", label: "spendable · up & down", note: "quest complete → +reward; redeem → −cost" },
    invariant: "tier = f(lifetimeCoins) — and f only ever moves forward.",
    source:
      "source · schema.prisma:18-23 · quests.service.ts:71-74 · rewards.service.ts:31 · tiers.ts:1-6, 20",
  },

  tenancy: {
    eyebrow: "§03 · ACCOUNTS & TENANCY",
    headline: "Real accounts, isolated tables.",
    lede:
      "Three details make LifeQuest a real multi-user product rather than a toy: hashed passwords, a co-tenancy story, and a demo account that can’t be broken.",
    facts: [
      {
        k: "ARGON2",
        v: "Passwords are hashed with argon2 on signup and verified on login — never stored or compared in plaintext.",
        cite: "auth.service.ts:2, 21, 47",
        tone: "teal",
      },
      {
        k: "CO-TENANT",
        v: "The deploy guide isolates every table inside ?schema=lifequest on a shared Supabase — co-tenant-ready Postgres, one schema per app.",
        cite: "apps/api/DEPLOY.md:22",
        tone: "sky",
      },
      {
        k: "DEMO FREEZE",
        v: "The shared demo account’s name + email are immutable server-side, so no visitor can lock everyone else out — while gameplay stays fully playable.",
        cite: "users.service.ts:47-59",
        tone: "coral",
      },
    ],
    honest:
      "Precise call: ?schema=lifequest is the documented co-tenancy recipe (Prisma keeps every table in that schema); the committed local default uses a database named lifequest.",
  },
} as const;

// ---------------------------------------------------------------------------
// Section 04 — PROOF
// ---------------------------------------------------------------------------

export const PROOF = {
  divider: { subtitle: "it persists, it’s playable, and it’s zero-purple" },

  persistence: {
    eyebrow: "§04 · THE RECEIPTS",
    headline: "Close the tab. It’s still there.",
    hero: "end-to-end",
    heroLabel: "persistence · documented + code-verified",
    body:
      "The claim is on the record: real accounts, and persisted quests, coins, and redemptions, with an independent live audit in 2026-07 reporting backend persistence verified end to end. Under it sits the mechanism — every award and every spend is a Prisma transaction against Postgres, so a completed quest and a redeemed reward are durable writes, not screen state.",
    codePath: [
      { k: "COMPLETE", v: "$transaction → progress COMPLETED + coins/lifetime ++", cite: "quests.service.ts:62-84" },
      { k: "REDEEM", v: "$transaction → coins −cost + a Redemption row", cite: "rewards.service.ts:28-49" },
    ],
    honest:
      "Honest seam: the public URL ships in demo mode — in-browser fixtures that re-seed on reload (a deliberate, backend-free clickthrough). Durable persistence engages the moment the SPA is pointed at the live API via one env var. Printed as documented, not re-benchmarked here.",
    source: "source · README.md:11 · DEPLOY.md:3 · demoClient.ts:90 · apiClient.ts:14",
  },

  mission: {
    eyebrow: "§04 · PLAYABLE",
    headline: "The hero card is real.",
    body: [
      "Most landing pages show a screenshot. LifeQuest’s shows a working mission: press Complete and the page pays out the same confetti and the same coins as the live game — before you have signed up for anything.",
      "It is the same loop the app runs on the inside — a real card, wired to the real reward burst, standing in for the whole product in a single interaction.",
    ],
    facts: [
      { k: "THE CARD", v: "a live mission on the landing page" },
      { k: "PRESS IT", v: "coins tick up + confetti — no signup" },
      { k: "SAME LOOP", v: "identical to the in-app Complete flow" },
    ],
    quote: "“go on. press it. this card is real.”",
    source: "source · LandingScreen.tsx:32-33, 44 · QuestsScreen.tsx:39-44",
  },

  mobile: {
    eyebrow: "§04 · IN YOUR HAND",
    headline: "A tab bar that travels.",
    body:
      "LifeQuest is desktop-first, but the web build is genuinely mobile. Below the large breakpoint the sidebar collapses into a sticky bottom tab bar — the five primary destinations, one thumb-reach away.",
    tabs: ["Home", "Quests", "Rewards", "Guild", "Settings"],
    note: "The bar is mobile-only (lg:hidden); on desktop the same five live in the sidebar.",
    source: "source · apps/desktop/src/layouts/AppLayout.tsx:195-216 (nav · Primary mobile)",
  },

  nopurple: {
    eyebrow: "§04 · THE RULE",
    headline: "Zero purple. By rule.",
    lede:
      "LifeQuest commits to a single, warm identity — the “dawn expedition” palette of coral, honey, aqua, and sky — and holds the line: no gradients, no purple. Not a preference; a stated rule.",
    swatches: [
      { name: "coral", hue: "14°", role: "the quest / the summit" },
      { name: "honey", hue: "41°", role: "coins / rewards" },
      { name: "aqua", hue: "168°", role: "wellness / success" },
      { name: "sky", hue: "199°", role: "community / the guild" },
    ],
    note:
      "Every accent hue lands in 14–201° — nothing in the violet band (~260–320°). Even the confetti is coral/honey/aqua/sky/paper.",
    source: "source · README.md:11 (“no purple”) · index.css:37-40 · lib/celebrate.ts:6",
  },
} as const;

// ---------------------------------------------------------------------------
// Section 05 — BUILD
// ---------------------------------------------------------------------------

export const BUILD = {
  divider: { subtitle: "one codebase ships to the desktop and the browser" },

  pipeline: {
    eyebrowLeft: "§05 · THE PIPELINE · LEFT",
    eyebrowRight: "§05 · THE PIPELINE · RIGHT",
    headlineLeft: "From one React app…",
    headlineRight: "…to two places at once.",
    subLeft:
      "A single Vite + React 19 codebase is wrapped by a Tauri 2 shell for the native window — `tauri build` runs the same `vite build` underneath.",
    subRight:
      "That one `dist/` is what the Tauri window loads and what Vercel serves on the web — with the NestJS API alongside as a serverless function.",
    stages: [
      { n: "1", label: "CODE", detail: "React 19 · Vite 7 · TS", accentKey: "02_HOW" },
      { n: "2", label: "SHELL", detail: "Tauri 2 · Rust", accentKey: "03_INSIDE" },
      { n: "3", label: "BUILD", detail: "tsc + vite → one dist/", accentKey: "05_BUILD" },
      { n: "4", label: "WEB", detail: "Vercel · the SPA", accentKey: "01_WHY" },
      { n: "5", label: "API", detail: "Nest fn · serverless", accentKey: "04_PROOF" },
    ],
    registry:
      "The same dist/ powers the native Tauri window and the Vercel web deploy — desktop-first, web-real, one build.",
    liveUrl: "lifequest-sigma-fawn.vercel.app",
    repoUrl: "github.com/yadava5/lifequest",
    source: "source · apps/desktop/package.json · src-tauri/tauri.conf.json · vercel.json",
  },

  stack: {
    eyebrow: "§05 · THE STACK",
    headline: "What it is built on.",
    lede:
      "One TypeScript monorepo: a Tauri + React client that also ships to the web, a NestJS + Fastify + Prisma API on Vercel serverless, and two shared packages holding the contract between them.",
    rows: [
      { area: "CLIENT", tech: "Tauri 2.9 · React 19 · Vite 7", note: "desktop-first; the same build runs on the web" },
      { area: "API", tech: "NestJS 11 · Fastify 4 · one Vercel fn", note: "boots once, reused across warm invocations" },
      { area: "DATA", tech: "Prisma 6 · Postgres (Supabase)", note: "transactional writes; the coin ledger" },
      { area: "AUTH", tech: "argon2 0.41 · Bearer sessions", note: "hashed passwords, no cookies" },
      { area: "SHARED", tech: "Zod schemas · client helpers", note: "packages/schemas + packages/client" },
      { area: "TOOLING", tech: "TypeScript 5 · ESLint · Prettier", note: "npm workspaces across apps/* + packages/*" },
    ],
    source: "source · apps/*/package.json · Cargo.toml · root package.json (workspaces)",
  },

  // Page 27 — the Try-It page: send the reader to the live product, and frame
  // the whole thing honestly as a concept + working prototype (how society helps).
  tryit: {
    eyebrow: "TRY IT",
    headline: "Play the prototype.",
    tagline:
      "Open the live demo, complete the hero mission, and watch the page pay you back — coins, confetti, a tier that climbs. No signup, no wall.",
    qrTarget: "https://lifequest-sigma-fawn.vercel.app",
    liveUrl: "lifequest-sigma-fawn.vercel.app",
    qrCaption: "scan to open the live app",
    demoNote:
      "One-click seeded demo — a real account is waiting, no signup. Or open it in any browser and click straight through the in-browser demo.",
    repoLabel: "SOURCE",
    repoUrl: "github.com/yadava5/lifequest",
    concept: {
      label: "A CONCEPT, NOT A FINISHED PRODUCT",
      body:
        "LifeQuest is an idea offered to society — a working prototype, not a funded product. Reaching the job-seekers who need it most needs a partner or funder to host it and seed rewards that fit real budgets.",
      adoptersLabel: "WHO COULD CARRY IT",
      adopters: [
        "Workforce nonprofits & job clubs",
        "University career centers",
        "Public libraries",
        "Workforce & unemployment offices",
      ],
    },
    microNote: "missions · coins · tiers · a guild",
  },
} as const;

// ---------------------------------------------------------------------------
// Back cover — a pure closing that mirrors the cover: full-bleed dawn art, a
// short closing line, colophon. No QR, no CTA (the Try-It page owns those now).
// ---------------------------------------------------------------------------

export const BACK_COVER = {
  colophon: ["LifeQuest", "System Card · Vol. 01", "Ayush Yadav · 2026"],
  closingStatement: "An idea for helping people find work — offered to whoever will carry it.",
  closingLine: "— Small wins, made to count.",
} as const;

/** Re-export so page modules can pull the section-key type without theme. */
export type { SectionKey };
