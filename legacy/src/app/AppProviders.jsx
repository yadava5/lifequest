import React from 'react';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import theme from '../styles/theme';
import { QuestProvider } from '../features/quests/QuestContext';
import { AuthProvider, useAuth } from '../features/auth/AuthContext';

const QuestProviderBridge = ({ children }) => {
  const { session } = useAuth();
  return <QuestProvider userId={session?.userId}>{children}</QuestProvider>;
};

const AppProviders = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles
      styles={(muiTheme) => ({
        ':root': {
          colorScheme: 'dark',
        },
        body: {
          margin: 0,
          minHeight: '100vh',
          background: `radial-gradient(140% 140% at 50% -20%, ${muiTheme.palette.primary.main}1f 0%, ${muiTheme.palette.background.default} 55%)`,
          color: muiTheme.palette.text.primary,
          WebkitFontSmoothing: 'antialiased',
        },
        '#root': {
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': {
          width: 10,
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(148, 163, 184, 0.4)',
          borderRadius: 999,
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
      })}
    />
    <AuthProvider>
      <QuestProviderBridge>{children}</QuestProviderBridge>
    </AuthProvider>
  </ThemeProvider>
);

export default AppProviders;
