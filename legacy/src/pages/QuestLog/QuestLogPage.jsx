import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { MonetizationOn as CoinIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useQuestState } from '../../features/quests/QuestContext';

const audienceLabels = {
  LAID_OFF: 'Career transition',
  RETIRED: 'New chapter',
  SHARED: 'All players',
};

const audienceOptions = [
  { label: 'All quests', value: 'all' },
  { label: audienceLabels.LAID_OFF, value: 'LAID_OFF' },
  { label: audienceLabels.RETIRED, value: 'RETIRED' },
  { label: 'Shared with everyone', value: 'SHARED' },
];

const QuestLogPage = () => {
  const { quests, completeQuest, loading, error } = useQuestState();
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [actionError, setActionError] = useState(null);
  const theme = useTheme();

  const summary = useMemo(() => {
    const total = quests.length;
    const completed = quests.filter((quest) => quest.status === 'COMPLETED').length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [quests]);

  const filteredQuests = useMemo(() => {
    if (audienceFilter === 'all') return quests;
    return quests.filter((quest) => quest.audience === audienceFilter || quest.audience === 'SHARED');
  }, [quests, audienceFilter]);

  const handleComplete = async (questId) => {
    try {
      await completeQuest(questId);
      setActionError(null);
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'grid', placeItems: 'center', minHeight: 320 }}>
        <CircularProgress />
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

  const surfaceBorder = `1px solid ${alpha(theme.palette.divider, 0.65)}`;
  const headingColor = theme.palette.text.primary;
  const subtextColor = theme.palette.text.secondary;

  return (
    <Box sx={{ p: 0 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ mb: 2, gap: 1.5 }}
        flexWrap="wrap"
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: headingColor }}>
            Quest Log
          </Typography>
          <Typography variant="body2" sx={{ color: subtextColor, mt: 0.5 }}>
            Track your progress and wrap up the quests that unlock new rewards.
          </Typography>
        </Box>
        <Select
          size="small"
          value={audienceFilter}
          onChange={(event) => setAudienceFilter(event.target.value)}
          sx={{
            minWidth: 180,
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            borderRadius: 3,
          }}
        >
          {audienceOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={`Total ${summary.total}`}
            sx={{ backgroundColor: alpha(theme.palette.info.main, 0.14), color: theme.palette.info.light ?? theme.palette.info.main }}
          />
        <Chip
          label={`Completed ${summary.completed}`}
          sx={{ backgroundColor: alpha(theme.palette.success.main, 0.2), color: theme.palette.success.main }}
        />
        <Chip
          label={`Pending ${summary.pending}`}
          sx={{ backgroundColor: alpha(theme.palette.warning.main, 0.2), color: theme.palette.warning.main }}
        />
      </Stack>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          border: surfaceBorder,
          overflow: 'hidden',
        }}
      >
        <Table size="medium" stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                '& th': { borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}` },
              }}
            >
              <TableCell sx={{ fontWeight: 600, color: headingColor }}>Quest</TableCell>
              <TableCell sx={{ fontWeight: 600, color: headingColor }}>Audience</TableCell>
              <TableCell sx={{ fontWeight: 600, color: headingColor }} align="right">
                Reward
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: headingColor }} align="center">
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: headingColor }} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuests.map((quest) => (
              <TableRow
                key={quest.progressId}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <TableCell sx={{ maxWidth: 240 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {quest.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: subtextColor }}>
                    {quest.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={
                      quest.audience === 'SHARED'
                        ? audienceLabels.SHARED
                        : quest.audience === 'LAID_OFF'
                        ? audienceLabels.LAID_OFF
                        : audienceLabels.RETIRED
                    }
                    sx={{
                      textTransform: 'capitalize',
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                      color: theme.palette.secondary.light ?? theme.palette.secondary.main,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                    <CoinIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} />
                    <Typography variant="subtitle2">{quest.reward}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={quest.status === 'COMPLETED' ? 'Completed' : 'Pending'}
                    sx={{
                      backgroundColor: alpha(
                        quest.status === 'COMPLETED' ? theme.palette.success.main : theme.palette.warning.main,
                        0.2
                      ),
                      color:
                        quest.status === 'COMPLETED'
                          ? theme.palette.success.main
                          : theme.palette.warning.light ?? theme.palette.warning.main,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  {quest.status === 'PENDING' ? (
                    <Button
                      onClick={() => handleComplete(quest.questId)}
                      variant="contained"
                      size="small"
                      sx={{
                        px: 2,
                        fontWeight: 600,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.8),
                        },
                      }}
                    >
                      Complete
                    </Button>
                  ) : (
                    <Typography variant="caption" sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
                      Claimed
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QuestLogPage;
