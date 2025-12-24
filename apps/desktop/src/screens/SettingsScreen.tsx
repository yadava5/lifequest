import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useJourneyStore, type JourneyState } from '@/store/journeyStore';
import { useEffect, useState } from 'react';
import { useProfileMutations } from '@/hooks/useProfileMutations';

const audienceOptions = [
  { label: 'Career transition', value: 'LAID_OFF' },
  { label: 'New chapter', value: 'RETIRED' },
];

export const SettingsScreen = () => {
  const user = useJourneyStore((state) => state.user);
  const { updateProfile, resetProgress } = useProfileMutations();
  const [profile, setProfile] = useState({ name: '', email: '', audience: 'LAID_OFF' as 'LAID_OFF' | 'RETIRED' });

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, audience: user.audience === 'RETIRED' ? 'RETIRED' : 'LAID_OFF' });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    try {
      const updatedUser = await updateProfile.mutateAsync(profile);
      if (updatedUser) {
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
