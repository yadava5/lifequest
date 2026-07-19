import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@lifequest/client';
import { useJourneyStore } from '@/store/journeyStore';
import { apiClient } from '@/lib/apiClient';

/** True when an error means the session is no longer accepted by the server. */
const isUnauthorized = (error: unknown): boolean => {
  if (error instanceof ApiError) return error.status === 401;
  // Fallback for non-ApiError throwers (older bundles, custom fetchers): match
  // the messages the API guard/session service actually emit.
  const msg = error instanceof Error ? error.message.toLowerCase() : '';
  return (
    msg.includes('unauthorized') ||
    msg.includes('session expired') ||
    msg.includes('authorization header')
  );
};

export const useUserQuery = () => {
  const token = useJourneyStore((state) => state.session?.id);
  const setUser = useJourneyStore((state) => state.setUser);
  const clearSession = useJourneyStore((state) => state.clearSession);

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      if (!token) throw new Error('Missing session');
      const user = await apiClient.users.me();
      setUser(user);
      return user;
    },
    enabled: Boolean(token),
    // Don't burn a retry on an auth failure — it will never succeed with the
    // same dead token, and we want the self-heal below to fire promptly.
    retry: (failureCount, error) => !isUnauthorized(error) && failureCount < 1,
    staleTime: 1000 * 30,
  });

  // TanStack Query v5 removed the `onError` callback from `useQuery`, so the
  // previous self-heal never ran — a persisted-but-expired session lingered
  // forever, dropping returning visitors into a dead app (no landing, every
  // write rejected). Clear the session on a 401 so the app falls back to the
  // public landing and a fresh sign-in.
  const { isError, error } = query;
  useEffect(() => {
    if (isError && isUnauthorized(error)) {
      clearSession();
    }
  }, [isError, error, clearSession]);

  return query;
};
