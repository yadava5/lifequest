import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DataTab = {
  id: string;
  label: string;
};

type TabState = {
  tabs: DataTab[];
  setTabs: (next: DataTab[]) => void;
};

const initialTabs: DataTab[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'progress', label: 'Progress' },
  { id: 'history', label: 'History' },
];

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: initialTabs,
      setTabs: (next) => set({ tabs: next }),
    }),
    { name: 'lifequest-tabs' }
  )
);
