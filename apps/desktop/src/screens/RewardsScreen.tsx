import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, LockSimple, Sparkle, Vault, Gift } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useJourneyStore } from '@/store/journeyStore';
import { useRewardsQuery } from '@/hooks/useRewardsQuery';
import { useRewardMutations } from '@/hooks/useRewardMutations';
import { celebrate } from '@/lib/celebrate';
import { cn } from '@/lib/utils';

export const RewardsScreen = () => {
  const user = useJourneyStore((state) => state.user);
  const { data: rewards = [] } = useRewardsQuery();
  const { redeemReward } = useRewardMutations();
  const [activeRewardId, setActiveRewardId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const redemptionHistory = user?.redemptions ?? [];

  const redeemedIds = useMemo(
    () => new Set(redemptionHistory.map((e) => e.reward.id)),
    [redemptionHistory],
  );
  const available = rewards.filter((r) => !redeemedIds.has(r.id));

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3500);
    return () => clearTimeout(t);
  }, [flash]);

  if (!user) return null;
  const coins = user.coins;

  const handleRedeem = (reward: (typeof rewards)[number]) => {
    setActiveRewardId(reward.id);
    redeemReward.mutate(reward, {
      onSuccess: () => {
        setFlash(`Unlocked ${reward.name}!`);
        celebrate();
      },
      onSettled: () => setActiveRewardId(null),
    });
  };

  return (
    <div className="space-y-6">
      {/* Vault header */}
      <div className="grad-border relative overflow-hidden rounded-2xl p-6">
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-primary">
              <Vault size={14} weight="fill" /> Reward vault
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Spend your hard-won coins</h1>
            <p className="serif mt-1 text-lg text-muted-foreground">Turn momentum into something real.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-2.5 shadow-glow-gold">
            <Coins size={22} weight="fill" className="text-gold" />
            <span className="font-display text-2xl font-bold tabular-nums">{coins.toLocaleString()}</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">balance</span>
          </div>
        </div>
        <Sparkle size={200} weight="thin" className="pointer-events-none absolute -right-8 -top-8 text-gold/10 animate-float" />
      </div>

      {flash && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 font-medium text-teal"
        >
          <Gift size={18} weight="fill" /> {flash}
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <section className="grid gap-4 sm:grid-cols-2">
          {available.length === 0 && (
            <p className="col-span-full rounded-2xl border border-border/70 bg-card/40 p-8 text-center text-muted-foreground">
              Vault cleared — you’ve claimed every reward. New drops soon. ✨
            </p>
          )}
          {available.map((reward, i) => {
            const affordable = coins >= reward.cost;
            const isRedeeming = activeRewardId === reward.id && redeemReward.isLoading;
            const progress = Math.min(100, Math.round((coins / reward.cost) * 100));
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'flex flex-col rounded-2xl border p-5 backdrop-blur-sm transition',
                  affordable
                    ? 'border-gold/30 bg-card/60 hover:shadow-glow-gold'
                    : 'border-border/60 bg-card/40',
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      'grid h-11 w-11 place-items-center rounded-xl border',
                      affordable ? 'border-gold/30 bg-gold/10 text-gold' : 'border-border bg-muted text-muted-foreground',
                    )}
                  >
                    {affordable ? <Gift size={20} weight="fill" /> : <LockSimple size={20} weight="fill" />}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-gold">
                    <Coins size={13} weight="fill" /> {reward.cost}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{reward.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{reward.description}</p>

                {!affordable && (
                  <div className="mt-3">
                    <div className="flex justify-between font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
                      <span>{reward.cost - coins} more to unlock</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gold/70" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                <Button
                  className="mt-4 gap-1.5"
                  variant={affordable ? 'default' : 'outline'}
                  disabled={!affordable || isRedeeming}
                  onClick={() => handleRedeem(reward)}
                >
                  {affordable ? (
                    <>
                      <Gift size={15} weight="fill" /> {isRedeeming ? 'Unlocking…' : 'Unlock reward'}
                    </>
                  ) : (
                    <>
                      <LockSimple size={15} weight="fill" /> Keep earning
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </section>

        <aside className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-sm">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">Claimed rewards</p>
          <p className="serif mt-1 text-lg">Your trophy shelf.</p>
          <div className="mt-4 space-y-3">
            {redemptionHistory.length === 0 && (
              <p className="text-sm text-muted-foreground">Nothing claimed yet — your first unlock lands here.</p>
            )}
            {redemptionHistory.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5">
                <Gift size={18} weight="fill" className="shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold">{entry.reward.name}</p>
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
