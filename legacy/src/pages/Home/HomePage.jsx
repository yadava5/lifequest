import React from 'react';
import { Box, Card, CardContent, Chip, CircularProgress, Stack, Typography, Alert } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import StatRing from '../../components/common/StatRing';
import { useQuestState } from '../../features/quests/QuestContext';

const tierBreakpoints = [0, 3, 6, 9, Infinity];
const tierNames = ['Explorer', 'Adventurer', 'Trailblazer', 'Master'];

const getTierInfo = (completed) => {
  const index = tierBreakpoints.findIndex((threshold) => completed < threshold) - 1;
  const safeIndex = Math.max(0, index);
  const currentTier = tierNames[safeIndex] ?? tierNames[0];
  const nextThreshold = tierBreakpoints[safeIndex + 1];

  if (!Number.isFinite(nextThreshold)) {
    return {
      currentTier,
      nextTier: 'Maxed Out',
      progressToNextTier: 100,
      questsRemaining: 0,
    };
  }

  const questsIntoTier = completed - tierBreakpoints[safeIndex];
  const questsNeededForTier = nextThreshold - tierBreakpoints[safeIndex];
  const progressToNextTier = questsNeededForTier ? (questsIntoTier / questsNeededForTier) * 100 : 0;
  const questsRemaining = Math.max(nextThreshold - completed, 0);

  return {
    currentTier,
    nextTier: tierNames[safeIndex + 1] ?? 'Maxed Out',
    progressToNextTier,
    questsRemaining,
  };
};

const HomePage = () => {
  const { user, quests, loading, error } = useQuestState();
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'grid', placeItems: 'center', minHeight: 320 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  const totalQuests = quests.length;
  const completedQuests = quests.filter((quest) => quest.status === 'COMPLETED').length;
  const pendingQuests = quests.filter((quest) => quest.status !== 'COMPLETED');
  const completionRate = totalQuests ? (completedQuests / totalQuests) * 100 : 0;

  const { currentTier, nextTier, progressToNextTier, questsRemaining } = getTierInfo(completedQuests);
  const nextUp = pendingQuests.slice(0, 3);

  const welcomeGradient = `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.24)} 0%, ${alpha(
    theme.palette.secondary.main,
    0.18
  )} 100%)`;
  const nextUpSurface = alpha(theme.palette.primary.main, 0.08);

  return (
    <Box sx={{ p: 0, display: 'grid', gap: 2 }}>
      <Card elevation={0} sx={{ background: welcomeGradient }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ color: alpha(theme.palette.text.primary, 0.78), fontWeight: 600 }}>
            Welcome back, {user?.name ?? 'Explorer'}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
            You have {user?.coins ?? 0} Quest Coins
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Complete missions to unlock real-world rewards and advance through LifeQuest tiers.
          </Typography>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="space-between">
        <StatRing
          value={Math.round(completionRate)}
          label={`${completedQuests}/${totalQuests}`}
          subtitle="Quests completed"
          color={theme.palette.success.main}
        />
        <StatRing
          value={Math.round(progressToNextTier)}
          label={currentTier}
          subtitle={nextTier === 'Maxed Out' ? 'All tiers achieved' : `${questsRemaining} quests to ${nextTier}`}
          color={theme.palette.info.main}
        />
      </Stack>

      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
            Next Up
          </Typography>
          {nextUp.length === 0 ? (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              You have completed every quest in this release. Check back soon for new adventures!
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {nextUp.map((quest) => (
                <Box
                  key={quest.questId}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.6,
                    p: 1.6,
                    borderRadius: 2,
                    backgroundColor: nextUpSurface,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {quest.title}
                    </Typography>
                    <Chip
                      label={`${quest.reward} coins`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.success.main, 0.15),
                        color: theme.palette.success.light ?? theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {quest.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomePage;
