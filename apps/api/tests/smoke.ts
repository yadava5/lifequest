import { spawn } from 'child_process';

const BASE_URL = 'http://localhost:4000/api';
const DEMO_EMAIL = 'demo@lifequest.app';
const DEMO_PASSWORD = 'LifeQuest123!';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForHealth(timeoutMs = 15000): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      if (response.ok) {
        return;
      }
    } catch (err) {
      // swallow until timeout
    }
    await wait(500);
  }
  throw new Error('Timed out waiting for /health');
}

async function assertOk<T>(response: Response, label: string): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${label} failed (${response.status}): ${body}`);
  }
  return response.json() as Promise<T>;
}

async function run() {
  console.log('[smoke] launching API');
  const server = spawn('node', ['dist/main.js'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  server.stdout.on('data', (chunk) => {
    process.stdout.write(`[api] ${chunk}`);
  });
  server.stderr.on('data', (chunk) => {
    process.stderr.write(`[api] ${chunk}`);
  });

  const stopServer = () => {
    if (!server.killed) {
      server.kill('SIGINT');
    }
  };

  try {
    await waitForHealth();
    console.log('[smoke] health OK');

    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
    });
    const user = await assertOk<{ id: string; audience: string; coins: number }>(loginResponse, 'login');

    const questsResponse = await fetch(`${BASE_URL}/quests?userId=${user.id}`);
    const quests = await assertOk<Array<{ id: string; status: string; quest: { id: string } }>>(questsResponse, 'quests list');

    const pending = quests.find((quest) => quest.status !== 'COMPLETED');
    if (pending) {
      const completeResponse = await fetch(`${BASE_URL}/quests/${pending.quest.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      await assertOk(completeResponse, 'quest completion');
      console.log('[smoke] quest completion OK');
    }

    const rewardsResponse = await fetch(`${BASE_URL}/rewards`);
    const rewards = await assertOk<Array<{ id: string; cost: number }>>(rewardsResponse, 'rewards list');
    const affordable = rewards.find((reward) => reward.cost <= user.coins);
    if (affordable) {
      const redeemResponse = await fetch(`${BASE_URL}/rewards/${affordable.id}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      await assertOk(redeemResponse, 'reward redemption');
      console.log('[smoke] reward redemption OK');
    }

    const meetupsResponse = await fetch(`${BASE_URL}/meetups?audience=${user.audience}`);
    await assertOk(meetupsResponse, 'meetups list');
    console.log('[smoke] meetups OK');

    console.log('[smoke] success');
  } finally {
    stopServer();
  }
}

run().catch((error) => {
  console.error('[smoke] FAILED', error);
  process.exitCode = 1;
});
