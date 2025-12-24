import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';

const isTauri = typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

type StoreModule = typeof import('@tauri-apps/plugin-store');

const createTauriStorage = (): StateStorage => {
  let storePromise: Promise<InstanceType<StoreModule['Store']>> | null = null;

  const getStore = async () => {
    if (!storePromise) {
      storePromise = import('@tauri-apps/plugin-store').then(({ Store }) => Store.load('lifequest-auth.json'));
    }
    return storePromise;
  };

  return {
    getItem: async (name) => {
      const store = await getStore();
      const value = await store.get(name);
      if (typeof value === 'string') {
        return value;
      }
      if (value !== undefined && value !== null) {
        return JSON.stringify(value);
      }
      return null;
    },
    setItem: async (name, value) => {
      const store = await getStore();
      await store.set(name, value);
      await store.save();
    },
    removeItem: async (name) => {
      const store = await getStore();
      await store.delete(name);
      await store.save();
    },
  };
};

export const sessionStorage = createJSONStorage(() => {
  if (isTauri) {
    return createTauriStorage();
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return memoryStorage;
});
