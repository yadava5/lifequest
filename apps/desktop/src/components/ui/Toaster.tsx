import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, Warning, XCircle, X } from 'phosphor-react';
import { useToastStore, type Toast, type ToastTone } from '@/store/toastStore';
import { cn } from '@/lib/utils';

/**
 * Toaster — the app's transient notice layer. Sits above the mobile tab bar and
 * out of the way on desktop. Warm-palette only (teal / gold / coral / sky), in
 * keeping with the dawn identity: no red-alert, no purple, no gradient.
 */
const TONE: Record<ToastTone, { icon: typeof Info; ring: string; text: string }> = {
  success: { icon: CheckCircle, ring: 'border-teal/30 bg-teal/10', text: 'text-teal' },
  warning: { icon: Warning, ring: 'border-gold/30 bg-gold/10', text: 'text-gold' },
  error: { icon: XCircle, ring: 'border-coral/30 bg-coral/10', text: 'text-coral' },
  info: { icon: Info, ring: 'border-sky/30 bg-sky/10', text: 'text-sky' },
};

const ToastRow = ({ toast }: { toast: Toast }) => {
  const dismissToast = useToastStore((s) => s.dismissToast);
  const meta = TONE[toast.tone];
  const Icon = meta.icon;

  useEffect(() => {
    const t = setTimeout(() => dismissToast(toast.id), 4200);
    return () => clearTimeout(t);
  }, [toast.id, dismissToast]);

  return (
    <motion.div
      layout
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border/70 bg-card/95 px-4 py-3 shadow-glow backdrop-blur-xl"
    >
      <span className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border', meta.ring, meta.text)}>
        <Icon size={18} weight="fill" />
      </span>
      <p className="min-w-0 flex-1 pt-1 text-sm font-medium text-foreground">{toast.message}</p>
      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        aria-label="Dismiss notification"
        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground"
      >
        <X size={14} weight="bold" />
      </button>
    </motion.div>
  );
};

export const Toaster = () => {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end sm:px-0">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastRow key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
