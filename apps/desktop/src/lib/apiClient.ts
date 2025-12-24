import { createApiClient } from '@lifequest/client';
import { useJourneyStore } from '@/store/journeyStore';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export const apiClient = createApiClient({
  baseUrl: API_BASE,
  getToken: () => useJourneyStore.getState().session?.id ?? null,
});
