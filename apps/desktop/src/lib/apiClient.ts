import { createApiClient } from '@lifequest/client';
import { useJourneyStore } from '@/store/journeyStore';
import { createDemoClient } from '@/lib/demoClient';

const API_BASE = import.meta.env.VITE_API_URL as string | undefined;

/**
 * With a real `VITE_API_URL` we talk to the live NestJS backend; without
 * one we fall back to a zero-backend in-browser demo client that speaks
 * the identical surface. This lets the deployed SPA be fully clickable on
 * its own, and upgrade to the real API by setting a single env var — no
 * app-code change.
 */
export const isDemoMode = !API_BASE;

export const apiClient = API_BASE
  ? createApiClient({
      baseUrl: API_BASE,
      getToken: () => useJourneyStore.getState().session?.id ?? null,
    })
  : createDemoClient();
