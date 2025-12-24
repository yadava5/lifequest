import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, UserResponse } from '@lifequest/client';
import { sessionStorage } from '@/lib/sessionStorage';

export type LastEvent = {
  id: string;
  message: string;
  kind: 'quest' | 'reward' | 'profile' | 'auth';
  timestamp: string;
};

const stampEvent = (message: string, kind: LastEvent['kind']): LastEvent => ({
  id: `evt-${Date.now()}`,
  message,
  kind,
  timestamp: new Date().toISOString(),
});

const initialState = {
  session: null as AuthResponse['session'] | null,
  user: null as UserResponse | null,
  lastEvent: undefined as LastEvent | undefined,
};

export type JourneyState = typeof initialState & {
  setAuthPayload: (payload: AuthResponse) => void;
  setUser: (user: UserResponse) => void;
  clearSession: () => void;
  updateUser: (mutator: (user: UserResponse) => UserResponse) => void;
  pushEvent: (message: string, kind: LastEvent['kind']) => void;
};

const STORE_KEY = 'lifequest-auth-v1';

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      ...initialState,
      setAuthPayload: (payload) =>
        set({
          session: payload.session,
          user: payload.user,
          lastEvent: stampEvent('Signed in', 'auth'),
        }),
      setUser: (user) =>
        set((state) => ({
          user,
          lastEvent: state.lastEvent,
        })),
      updateUser: (mutator) =>
        set((state) => {
          if (!state.user) {
            return state;
          }
          return {
            user: mutator(state.user),
          };
        }),
      clearSession: () => set(initialState),
      pushEvent: (message, kind) => set({ lastEvent: stampEvent(message, kind) }),
    }),
    {
      name: STORE_KEY,
      storage: sessionStorage,
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        lastEvent: state.lastEvent,
      }),
    }
  )
);
