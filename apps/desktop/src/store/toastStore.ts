import { create } from 'zustand';

/**
 * Lightweight, app-wide toast queue.
 *
 * Mutations (and any handler) can surface a friendly, transient message from
 * anywhere — including outside React — via `useToastStore.getState().pushToast`.
 * This is what turns a raw `ApiError` (e.g. a 409 from double-completing a
 * quest) into a calm notice instead of an uncaught page error.
 */
export type ToastTone = 'info' | 'success' | 'warning' | 'error';

export type Toast = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastState = {
  toasts: Toast[];
  pushToast: (message: string, tone?: ToastTone) => void;
  dismissToast: (id: string) => void;
};

const makeId = () => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (message, tone = 'info') =>
    set((state) => {
      // De-dupe an identical message that is already on screen so a burst of
      // repeated failures reads as one calm notice, not a stack of clones.
      if (state.toasts.some((t) => t.message === message)) return state;
      return { toasts: [...state.toasts, { id: makeId(), message, tone }] };
    }),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
