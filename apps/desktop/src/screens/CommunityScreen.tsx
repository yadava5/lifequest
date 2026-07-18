import { motion } from 'framer-motion';
import { UsersThree, MapPin, CalendarBlank, Trophy, Sparkle } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import { useJourneyStore } from '@/store/journeyStore';
import { demoMeetups } from '@/data/demo';
import { questTheme } from '@/lib/questTheme';
import { cn } from '@/lib/utils';

const audienceTheme = (audience: string) => {
  if (audience === 'RETIRED') return questTheme('WELLNESS');
  if (audience === 'SHARED') return questTheme('TASK');
  return questTheme('COMMUNITY');
};

export const CommunityScreen = () => {
  const redemptions = useJourneyStore((state) => state.user?.redemptions ?? []);

  return (
    <div className="space-y-6">
      <div>
        <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-primary">
          <UsersThree size={14} weight="fill" /> Guild
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Rally your crew</h1>
        <p className="serif mt-1 text-lg text-muted-foreground">No one levels up alone.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">Upcoming gatherings</p>
          <div className="mt-4 space-y-3">
            {demoMeetups.map((meetup, i) => {
              const t = audienceTheme(meetup.audience);
              return (
                <motion.div
                  key={meetup.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={cn('rounded-xl border border-border/60 p-4 transition', t.glow)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                        <CalendarBlank size={12} weight="fill" /> {meetup.date}
                      </p>
                      <p className="mt-1 font-display font-semibold">{meetup.title}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin size={13} weight="fill" /> {meetup.location}
                      </p>
                    </div>
                    <span className={cn('rounded-full border px-2.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest', t.bg, t.border, t.text)}>
                      {meetup.audience.replace('_', ' ')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm">
          <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">
            <Trophy size={14} weight="fill" className="text-gold" /> Shared wins
          </p>
          <div className="mt-4 flex-1 space-y-3">
            {redemptions.length === 0 && (
              <div className="grid place-items-center rounded-xl border border-dashed border-border/60 p-8 text-center">
                <Sparkle size={28} weight="thin" className="text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No shared wins yet — claim a reward to inspire the guild.</p>
              </div>
            )}
            {redemptions.map((reward) => (
              <div key={reward.id} className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3">
                <Trophy size={18} weight="fill" className="shrink-0 text-gold" />
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">{reward.reward.name}</p>
                  <p className="font-mono text-[0.58rem] uppercase tracking-widest text-muted-foreground">
                    {new Date(reward.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-4 w-full gap-2">
            <Sparkle size={16} weight="fill" /> Share your latest win
          </Button>
        </section>
      </div>
    </div>
  );
};
