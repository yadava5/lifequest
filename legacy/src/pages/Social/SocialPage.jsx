import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useQuestState } from '../../features/quests/QuestContext';
import { fetchMeetups } from '../../lib/api';

const SocialPage = () => {
  const { user, loading: userLoading, error: userError } = useQuestState();
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const audienceLabels = {
    LAID_OFF: 'Career transition',
    RETIRED: 'New chapter',
    SHARED: 'All players',
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchMeetups(user.audience)
      .then((data) => {
        setMeetups(data);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (userLoading) {
    return (
      <Box sx={{ p: 2, display: 'grid', placeItems: 'center', minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{userError.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, display: 'grid', gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        Community
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        Meet other LifeQuest players, join local adventures, and celebrate progress together.
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
            Upcoming meetups
          </Typography>
          {loading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : error ? (
            <Alert severity="error">{error.message}</Alert>
          ) : meetups.length === 0 ? (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              No meetups are scheduled for your audience yet. Check back soon!
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {meetups.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    p: 1.6,
                    borderRadius: 2.5,
                    backgroundColor: alpha(theme.palette.success.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {event.location}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {new Date(event.startsAt).toLocaleString()}
                    </Typography>
                    <Chip
                      label={
                        event.audience === 'SHARED'
                          ? audienceLabels.SHARED
                          : event.audience === 'LAID_OFF'
                          ? audienceLabels.LAID_OFF
                          : audienceLabels.RETIRED
                      }
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                        color: theme.palette.secondary.light ?? theme.palette.secondary.main,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
            Shared stories
          </Typography>
          <List disablePadding>
            {(user?.redemptions ?? []).map((story, index) => (
              <React.Fragment key={story.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.25),
                        color: theme.palette.primary.contrastText,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                        fontWeight: 600,
                      }}
                    >
                      {user?.name
                        ?.split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {story.reward.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                          Redeemed on {new Date(story.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography component="span" variant="caption" sx={{ color: alpha(theme.palette.primary.main, 0.8) }}>
                          {story.reward.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < (user?.redemptions?.length ?? 0) - 1 && (
                  <Divider component="li" sx={{ borderColor: alpha(theme.palette.divider, 0.6) }} />
                )}
              </React.Fragment>
            ))}
            {(!user?.redemptions || user.redemptions.length === 0) && (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                You haven’t redeemed a reward yet—grab one from the store to share your story here.
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SocialPage;
