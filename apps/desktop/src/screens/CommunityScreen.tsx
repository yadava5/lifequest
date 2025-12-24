import { demoMeetups } from '@/data/demo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJourneyStore } from '@/store/journeyStore';

export const CommunityScreen = () => {
  const redemptions = useJourneyStore((state) => state.user?.redemptions ?? []);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Meetups & gatherings</CardTitle>
          <CardDescription>Opportunities curated by audience focus.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {demoMeetups.map((meetup) => (
            <div key={meetup.id} className="rounded-2xl border px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{meetup.date}</p>
                  <p className="text-base font-semibold">{meetup.title}</p>
                  <p className="text-sm text-muted-foreground">{meetup.location}</p>
                </div>
                <Badge>{meetup.audience}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Shared wins</CardTitle>
          <CardDescription>Recent redemptions worth celebrating.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {redemptions.length === 0 && <p className="text-sm text-muted-foreground">No shared wins yet. Redeem a reward to inspire the crew.</p>}
          {redemptions.map((reward) => (
            <div key={reward.id} className="rounded-2xl border px-4 py-3">
              <p className="text-sm text-muted-foreground">{new Date(reward.createdAt).toLocaleDateString()}</p>
              <p className="font-semibold">{reward.reward.name}</p>
              <p className="text-sm text-muted-foreground">{reward.reward.description}</p>
            </div>
          ))}
        </CardContent>
        <div className="border-t px-6 py-4">
          <Button variant="ghost" className="w-full">
            Share your latest win
          </Button>
        </div>
      </Card>
    </div>
  );
};
