import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { demoMeetups } from '@/data/demo';
import { MapPin } from 'lucide-react';

export const CommunityPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Meetups</CardTitle>
        <p className="text-sm text-muted-foreground">Tailored to your current audience focus.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoMeetups.map((meetup) => (
          <div key={meetup.id} className="rounded-2xl border border-border/40 bg-background/40 p-4">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{meetup.audience}</p>
            <p className="text-base font-semibold">{meetup.title}</p>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{meetup.location}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{meetup.date}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
