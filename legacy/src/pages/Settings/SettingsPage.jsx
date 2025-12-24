import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useQuestState } from '../../features/quests/QuestContext';
import { useAuth } from '../../features/auth/AuthContext';

const audienceOptions = [
  { label: 'Career transition', value: 'LAID_OFF' },
  { label: 'New chapter', value: 'RETIRED' },
];

const SettingsPage = () => {
  const { user, updateProfile, resetProgress, loading } = useQuestState();
  const { syncUser, logout } = useAuth();
  const [formState, setFormState] = useState({ name: '', email: '', audience: 'LAID_OFF' });
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormState({
        name: user.name ?? '',
        email: user.email ?? '',
        audience: user.audience ?? 'LAID_OFF',
      });
    }
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      formState.name.trim() !== (user.name ?? '') ||
      (formState.email ?? '').trim() !== (user.email ?? '') ||
      formState.audience !== user.audience
    );
  }, [formState, user]);

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !hasChanges) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updated = await updateProfile({
        name: formState.name.trim(),
        email: formState.email.trim() || null,
        audience: formState.audience,
      });
      syncUser(updated);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.message ?? 'Unable to update profile right now.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetProgress = async () => {
    if (!user) return;
    setResetting(true);
    setError('');
    setSuccess('');
    try {
      await resetProgress();
      setSuccess('Quest progress has been reset.');
    } catch (err) {
      setError(err.message ?? 'Failed to reset progress.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 6, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ p: 0, display: 'grid', gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Account settings
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Update your profile details, adjust your player focus, or reset your progress.
      </Typography>

      {(error || success) && (
        <Alert severity={error ? 'error' : 'success'}>{error || success}</Alert>
      )}

      <Card elevation={0}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Display name"
                value={formState.name}
                onChange={handleFieldChange('name')}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formState.email}
                onChange={handleFieldChange('email')}
                helperText="Used to retrieve your account across devices."
              />
              <FormControl fullWidth>
                <InputLabel id="audience-select-label">Player focus</InputLabel>
                <Select
                  labelId="audience-select-label"
                  label="Player focus"
                  value={formState.audience}
                  onChange={handleFieldChange('audience')}
                >
                  {audienceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                disabled={!hasChanges || saving}
                sx={{ fontWeight: 600 }}
              >
                {saving ? 'Saving changes…' : 'Save changes'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={0}>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Progress controls
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Resetting will restore your coins to 1,000 and repopulate quests for your chosen audience.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleResetProgress}
                disabled={resetting}
                sx={{ borderColor: alpha('#fbbf24', 0.4), color: '#fbbf24' }}
              >
                {resetting ? 'Resetting…' : 'Reset progress'}
              </Button>
              <Button variant="text" color="error" onClick={logout}>
                Sign out
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Divider sx={{ borderColor: alpha('#94a3b8', 0.2) }} />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Need help migrating your profile? Email support@lifequest.app and we’ll get you set up.
      </Typography>
    </Box>
  );
};

export default SettingsPage;
