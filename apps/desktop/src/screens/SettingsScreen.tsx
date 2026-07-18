import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useJourneyStore, type JourneyState } from '@/store/journeyStore';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'phosphor-react';
import { useProfileMutations } from '@/hooks/useProfileMutations';

const audienceOptions = [
  { label: 'Career transition', value: 'LAID_OFF' },
  { label: 'New chapter', value: 'RETIRED' },
];

export const SettingsScreen = () => {
  const user = useJourneyStore((state) => state.user);
  const { updateProfile, resetProgress } = useProfileMutations();
  const [profile, setProfile] = useState({ name: '', email: '', audience: 'LAID_OFF' as 'LAID_OFF' | 'RETIRED' });
  const [readOnlyNotice, setReadOnlyNotice] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, audience: user.audience === 'RETIRED' ? 'RETIRED' : 'LAID_OFF' });
    }
  }, [user]);

  // Auto-dismiss the read-only notice so it reads like a transient toast.
  useEffect(() => {
    if (!readOnlyNotice) return;
    const timer = setTimeout(() => setReadOnlyNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [readOnlyNotice]);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    // Capture what we asked the server to persist so we can detect when the
    // shared demo account silently rejects an identity change (200 + revert).
    const attempted = { name: profile.name.trim(), email: profile.email.trim() };
    setReadOnlyNotice(null);
    try {
      const updatedUser = await updateProfile.mutateAsync(profile);
      if (updatedUser) {
        const nameBlocked = attempted.name.length > 0 && attempted.name !== updatedUser.name;
        const emailBlocked = attempted.email.length > 0 && attempted.email !== (updatedUser.email ?? '');
        if (nameBlocked || emailBlocked) {
          setReadOnlyNotice('Display name and email can’t be changed on the shared demo account.');
        }
        setProfile({
          name: updatedUser.name,
          email: updatedUser.email ?? '',
          audience: updatedUser.audience === 'RETIRED' ? 'RETIRED' : 'LAID_OFF',
        });
      }
    } catch (error) {
      console.error('Unable to update profile', error);
    }
  };

  const handleReset = async () => {
    try {
      const updatedUser = await resetProgress.mutateAsync();
      if (updatedUser) {
        setProfile({
          name: updatedUser.name,
          email: updatedUser.email ?? '',
          audience: updatedUser.audience === 'RETIRED' ? 'RETIRED' : 'LAID_OFF',
        });
      }
    } catch (error) {
      console.error('Unable to reset profile', error);
    }
  };

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Account preferences</CardTitle>
          <CardDescription>Update how LifeQuest shows up across devices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            Display name
            <input
              value={profile.name}
              onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-2 w-full rounded-2xl border px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
          <label className="text-sm font-medium text-muted-foreground">
            Email
            <input
              value={profile.email}
              onChange={(event) => setProfile((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-2 w-full rounded-2xl border px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
          <label className="text-sm font-medium text-muted-foreground">
            Focus audience
            <select
              value={profile.audience}
              onChange={(event) => setProfile((prev) => ({ ...prev, audience: event.target.value as 'LAID_OFF' | 'RETIRED' }))}
              className="mt-2 w-full rounded-2xl border px-4 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {audienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </CardContent>
        <div className="border-t px-6 py-4">
          <Button className="w-full" onClick={handleSave} disabled={updateProfile.isLoading}>
            Save changes
          </Button>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Controls & exports</CardTitle>
          <CardDescription>Reset progress or export your data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border px-4 py-3">
            <p className="font-semibold text-foreground">Reset quest progress</p>
            <p className="text-sm text-muted-foreground">
              Restore the default coins and repopulate quests for your focus.
            </p>
            <Button variant="outline" className="mt-3" size="sm" onClick={handleReset} disabled={resetProgress.isLoading}>
              Reset progress
            </Button>
          </div>
          <div className="rounded-2xl border px-4 py-3">
            <p className="font-semibold text-foreground">Data export</p>
            <p className="text-sm text-muted-foreground">Download quests, rewards, and redemptions as JSON.</p>
            <Button
              variant="ghost"
              className="mt-3"
              size="sm"
              onClick={() => downloadExport(user)}
            >
              Download export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

      <AnimatePresence>
        {readOnlyNotice && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-gold/30 bg-card/95 px-4 py-3 shadow-glow backdrop-blur-xl sm:inset-x-auto sm:right-6"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
              <Info size={18} weight="fill" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground">Demo account is read-only</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{readOnlyNotice}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const downloadExport = (user: NonNullable<JourneyState['user']>) => {
  const payload = {
    exportedAt: new Date().toISOString(),
    user,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'lifequest-export.json';
  anchor.click();
  URL.revokeObjectURL(url);
};
