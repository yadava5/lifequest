import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { signInUser, signUpUser } from '../../lib/api';

const storageKey = 'lifequest.session';

const loadStoredSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.userId) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.warn('Failed to read stored session', err);
    return null;
  }
};

const storeSession = (session) => {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      window.localStorage.setItem(storageKey, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(storageKey);
    }
  } catch (err) {
    console.warn('Failed to persist session', err);
  }
};

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => loadStoredSession());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const syncSession = useCallback((nextSessionOrUpdater) => {
    setSession((previous) => {
      const nextSession =
        typeof nextSessionOrUpdater === 'function'
          ? nextSessionOrUpdater(previous)
          : nextSessionOrUpdater;
      storeSession(nextSession ?? null);
      return nextSession ?? null;
    });
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        const user = await signInUser({ email, password });
        syncSession({
          userId: user.id,
          name: user.name,
          email: user.email ?? '',
          audience: user.audience,
        });
        return user;
      } catch (error) {
        setAuthError(error);
        throw error;
      } finally {
        setAuthLoading(false);
      }
    },
    [syncSession]
  );

  const signup = useCallback(
    async ({ name, email, password, audience }) => {
      setAuthLoading(true);
      setAuthError(null);
      try {
        const user = await signUpUser({ name, email, password, audience });
        syncSession({
          userId: user.id,
          name: user.name,
          email: user.email ?? '',
          audience: user.audience,
        });
        return user;
      } catch (error) {
        setAuthError(error);
        throw error;
      } finally {
        setAuthLoading(false);
      }
    },
    [syncSession]
  );

  const logout = useCallback(() => {
    syncSession(null);
  }, [syncSession]);

  const syncUser = useCallback(
    (user) => {
      if (!user) return;
      syncSession((previous) => {
        if (!previous) {
          return previous;
        }
        return {
          ...previous,
          name: user.name,
          email: user.email ?? previous.email ?? '',
          audience: user.audience,
        };
      });
    },
    [syncSession]
  );

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.userId),
      authLoading,
      authError,
      login,
      signup,
      logout,
      syncUser,
    }),
    [session, authLoading, authError, login, signup, logout, syncUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
