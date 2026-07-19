import {
  authLoginPayloadSchema,
  authSignupPayloadSchema,
  authResponseSchema,
  updateUserPayloadSchema,
  userResponseSchema,
  rewardSchema,
  questProgressSchema,
  logRitualPayloadSchema,
} from '@lifequest/schemas';
import { z } from 'zod';

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type ClientConfig = {
  baseUrl: string;
  getToken?: () => Promise<string | null | undefined> | string | null | undefined;
  fetchFn?: FetchLike;
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

const defaultFetch: FetchLike = (input, init) => fetch(input, init);

/**
 * Error thrown for any non-2xx API response. Carries the HTTP `status` so
 * callers can reliably distinguish an expired/invalid session (401) from a
 * transient server or network fault — without brittle message-substring
 * matching. `message` still holds the server's human-readable reason, so
 * existing `error.message` consumers keep working unchanged.
 */
export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const createApiClient = (config: ClientConfig) => {
  const fetchImpl = config.fetchFn ?? defaultFetch;

  const request = async <T>(path: string, schema: z.ZodType<T>, options: RequestOptions = {}) => {
    const token =
      options.token !== undefined
        ? options.token
        : typeof config.getToken === 'function'
          ? await config.getToken()
          : undefined;

    const hasBody = options.body !== undefined;
    const response = await fetchImpl(`${config.baseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorBody = await response.json();
        if (typeof errorBody?.message === 'string') {
          message = errorBody.message;
        }
      } catch {
        // ignore parse errors
      }
      throw new ApiError(message || 'Request failed', response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const json = await response.json();
    return schema.parse(json);
  };

  return {
    auth: {
      signup: (payload: z.infer<typeof authSignupPayloadSchema>) =>
        request('/auth/signup', authResponseSchema, { method: 'POST', body: authSignupPayloadSchema.parse(payload) }),
      login: (payload: z.infer<typeof authLoginPayloadSchema>) =>
        request('/auth/login', authResponseSchema, { method: 'POST', body: authLoginPayloadSchema.parse(payload) }),
      logout: () => request<void>('/auth/logout', z.undefined(), { method: 'POST' }),
    },
    users: {
      me: () => request('/users/me', userResponseSchema),
      update: (payload: z.infer<typeof updateUserPayloadSchema>) =>
        request('/users/me', userResponseSchema, { method: 'PATCH', body: updateUserPayloadSchema.parse(payload) }),
      reset: () => request('/users/me/reset', userResponseSchema, { method: 'POST' }),
      logRitual: (payload: z.infer<typeof logRitualPayloadSchema>) =>
        request('/users/me/rituals', userResponseSchema, {
          method: 'POST',
          body: logRitualPayloadSchema.parse(payload),
        }),
    },
    quests: {
      list: () => request('/quests', z.array(questProgressSchema)),
      start: (questId: string) => request(`/quests/${questId}/start`, z.any(), { method: 'POST' }),
      complete: (questId: string) => request(`/quests/${questId}/complete`, z.any(), { method: 'POST' }),
    },
    rewards: {
      list: () => request('/rewards', z.array(rewardSchema)),
      redeem: (rewardId: string) => request(`/rewards/${rewardId}/redeem`, z.any(), { method: 'POST' }),
    },
  };
};

type InferPromise<T> = T extends Promise<infer R> ? R : never;

export type ApiClient = ReturnType<typeof createApiClient>;
export type AuthResponse = InferPromise<ReturnType<ApiClient['auth']['signup']>>;
export type UserResponse = InferPromise<ReturnType<ApiClient['users']['me']>>;
