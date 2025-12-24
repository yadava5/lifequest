import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Typography,
  CircularProgress,
} from '@mui/material';
import { MonetizationOn as CoinIcon, Check as CheckIcon } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useQuestState } from '../../features/quests/QuestContext';

const RewardsPage = () => {
  const { user, rewards, redeemReward, loading, error } = useQuestState();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialogState, setDialogState] = useState({ open: false, reward: null, success: false });
  const theme = useTheme();

  const affordableRewards = useMemo(
    () => rewards.filter((reward) => (user?.coins ?? 0) >= reward.cost),
    [rewards, user]
  );

  const handleRedeemClick = (reward) => {
    setDialogState({ open: true, reward, success: false });
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, reward: null, success: false });
  };

  const handleConfirmPurchase = async () => {
    if (!dialogState.reward) return;

    try {
      const response = await redeemReward(dialogState.reward.id);
      setDialogState((prev) => ({ ...prev, success: true }));
      setSnackbar({ open: true, message: `Successfully redeemed ${dialogState.reward.name}!`, severity: 'success' });
      setTimeout(() => setDialogState({ open: false, reward: null, success: false }), 1500);
      return response;
    } catch (redeemError) {
      setSnackbar({ open: true, message: redeemError.message, severity: 'error' });
      setDialogState({ open: false, reward: null, success: false });
      return null;
    }
  };

  const handleCloseSnackbar = () => setSnackbar((state) => ({ ...state, open: false }));

  const coins = user?.coins ?? 0;
  const projectedBalance = dialogState.reward ? Math.max(coins - dialogState.reward.cost, 0) : coins;

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

  const panelBackground = alpha(theme.palette.primary.main, 0.08);
  const borderColor = `1px solid ${alpha(theme.palette.primary.main, 0.2)}`;

  return (
    <Box sx={{ p: 0, display: 'grid', gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        Rewards Store
      </Typography>
      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
        Redeem Quest Coins for perks that reinforce your progress and keep you inspired.
      </Typography>

      <Box
        sx={{
          background: panelBackground,
          p: 2,
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: borderColor,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
          Current balance
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CoinIcon sx={{ color: theme.palette.warning.main, fontSize: 28 }} />
          <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
            {coins}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {rewards.map((reward) => {
          const canRedeem = coins >= reward.cost;
          return (
            <Grid item xs={12} sm={6} key={reward.id}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  background: alpha(theme.palette.background.paper, 0.92),
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'grid', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {reward.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    {reward.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
                    <CoinIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: canRedeem ? theme.palette.success.main : theme.palette.warning.main,
                        fontWeight: 600,
                      }}
                    >
                      {reward.cost}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    variant={canRedeem ? 'contained' : 'outlined'}
                    disabled={!canRedeem}
                    onClick={() => handleRedeemClick(reward)}
                    sx={{
                      background: canRedeem ? theme.palette.primary.main : 'transparent',
                      color: canRedeem ? theme.palette.primary.contrastText : theme.palette.warning.main,
                      '&:hover': {
                        background: canRedeem
                          ? alpha(theme.palette.primary.main, 0.86)
                          : alpha(theme.palette.warning.main, 0.12),
                      },
                    }}
                  >
                    {canRedeem ? 'Redeem' : 'Keep earning'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={dialogState.open} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        {dialogState.success ? (
          <Box
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: theme.palette.success.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 16px 40px ${alpha(theme.palette.success.main, 0.45)}`,
              }}
            >
              <CheckIcon sx={{ color: '#fff', fontSize: 36 }} />
            </Box>
            <Typography variant="h6" sx={{ color: theme.palette.success.main, fontWeight: 600 }}>
              Reward redeemed!
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Enjoy {dialogState.reward?.name}. Keep completing quests to unlock more perks.
            </Typography>
          </Box>
        ) : (
          <>
            <DialogTitle sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              Confirm redemption
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Redeem <strong>{dialogState.reward?.name}</strong> for {dialogState.reward?.cost} Quest Coins?
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Your balance after checkout: {projectedBalance} coins
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ color: theme.palette.text.secondary }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmPurchase}
                sx={{
                  background: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': { background: alpha(theme.palette.primary.main, 0.8) },
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', color: theme.palette.text.secondary }}>
        <Typography variant="body2">Affordable right now:</Typography>
        {affordableRewards.length === 0 ? (
          <Typography variant="body2">Complete more quests to unlock your first reward.</Typography>
        ) : (
          affordableRewards.map((reward) => (
            <ChipWithIcon key={reward.id} label={reward.name} />
          ))
        )}
      </Box>
    </Box>
  );
};

const ChipWithIcon = ({ label }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderRadius: 999,
        background: alpha(theme.palette.success.main, 0.18),
        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
      }}
    >
      <CoinIcon sx={{ color: theme.palette.success.main, fontSize: 16 }} />
      <Typography variant="caption" sx={{ color: theme.palette.success.light ?? theme.palette.success.main, fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default RewardsPage;
