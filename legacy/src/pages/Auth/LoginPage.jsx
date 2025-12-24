import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const audienceOptions = [
  { label: 'Career transition', value: 'LAID_OFF' },
  { label: 'New chapter', value: 'RETIRED' },
];

const LoginPage = () => {
  const { isAuthenticated, login, signup, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('signin');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [signinForm, setSigninForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    audience: 'LAID_OFF',
  });

  const from = useMemo(() => location.state?.from?.pathname ?? '/', [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleModeToggle = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
  };

  const handleSigninChange = (field) => (event) => {
    setSigninForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSignupChange = (field) => (event) => {
    setSignupForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'signin') {
      const email = signinForm.email.trim();
      const password = signinForm.password.trim();
      if (!email || !password) {
        setErrorMessage('Enter your email and password.');
        return;
      }
      try {
        await login({ email, password });
        navigate('/', { replace: true });
      } catch (error) {
        setErrorMessage(error.message ?? 'Unable to sign in.');
      }
      return;
    }

    const name = signupForm.name.trim();
    const email = signupForm.email.trim();
    const password = signupForm.password.trim();
    const confirm = signupForm.confirmPassword.trim();

    if (!name || !email || !password) {
      setErrorMessage('Fill out all required fields to create an account.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirm) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await signup({
        name,
        email,
        password,
        audience: signupForm.audience,
      });
      setSuccessMessage('Account created! Redirecting to your dashboard.');
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(error.message ?? 'Unable to create your account right now.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {mode === 'signin' ? 'Welcome back' : 'Create your LifeQuest account'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {mode === 'signin'
                  ? 'Sign in to continue your quests and track your real-world progress.'
                  : 'Complete the form below to start your journey and unlock tailored quests.'}
              </Typography>
            </Stack>

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                {mode === 'signup' && (
                  <TextField
                    label="Full name"
                    placeholder="Alex Explorer"
                    value={signupForm.name}
                    onChange={handleSignupChange('name')}
                    required
                    inputProps={{ 'data-testid': 'signup-name' }}
                  />
                )}

                <TextField
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={mode === 'signin' ? signinForm.email : signupForm.email}
                  onChange={mode === 'signin' ? handleSigninChange('email') : handleSignupChange('email')}
                  required
                  inputProps={{ 'data-testid': `${mode}-email` }}
                />

                <TextField
                  label="Password"
                  type="password"
                  value={mode === 'signin' ? signinForm.password : signupForm.password}
                  onChange={mode === 'signin' ? handleSigninChange('password') : handleSignupChange('password')}
                  required
                  inputProps={{ 'data-testid': `${mode}-password` }}
                />

                {mode === 'signup' && (
                  <>
                    <TextField
                      label="Confirm password"
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange('confirmPassword')}
                      required
                      inputProps={{ 'data-testid': 'signup-confirm-password' }}
                    />
                    <FormControl fullWidth>
                      <InputLabel id="audience-label">Player focus</InputLabel>
                      <Select
                        labelId="audience-label"
                        label="Player focus"
                        value={signupForm.audience}
                        onChange={handleSignupChange('audience')}
                        inputProps={{ 'data-testid': 'signup-audience' }}
                      >
                        {audienceOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={authLoading}
                  sx={{ fontWeight: 600 }}
                >
                  {authLoading
                    ? mode === 'signin'
                      ? 'Signing you in…'
                      : 'Creating your account…'
                    : mode === 'signin'
                    ? 'Enter LifeQuest'
                    : 'Start your adventure'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {mode === 'signin' ? (
                <>
                  Need an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={handleModeToggle}
                    sx={{ fontWeight: 600 }}
                    data-testid="toggle-signup"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={handleModeToggle}
                    sx={{ fontWeight: 600 }}
                    data-testid="toggle-signin"
                  >
                    Sign in instead
                  </Link>
                </>
              )}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
