import { alpha, createTheme } from '@mui/material/styles';

const palette = {
  mode: 'dark',
  primary: { main: '#38bdf8', contrastText: '#020617' },
  secondary: { main: '#a855f7', contrastText: '#020617' },
  background: {
    default: '#020617',
    paper: '#0b1729',
  },
  text: {
    primary: '#e2e8f0',
    secondary: '#94a3b8',
  },
  success: { main: '#22c55e' },
  warning: { main: '#f59e0b' },
  info: { main: '#22d3ee' },
  divider: 'rgba(148, 163, 184, 0.22)',
};

const baseShadow = '0 24px 48px rgba(2, 12, 27, 0.45)';

const theme = createTheme({
  palette,
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: `'Inter', 'SF Pro Text', 'Segoe UI', sans-serif`,
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha(palette.background.paper, 0.94),
          border: `1px solid ${alpha(palette.divider, 0.7)}`,
          boxShadow: baseShadow,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha('#0f172a', 0.86),
          border: `1px solid ${alpha(palette.divider, 0.6)}`,
          boxShadow: baseShadow,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderBottom: `1px solid ${alpha(palette.divider, 0.6)}`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha('#0f172a', 0.94),
          border: `1px solid ${alpha(palette.divider, 0.7)}`,
          boxShadow: baseShadow,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: alpha('#0f172a', 0.94),
          border: `1px solid ${alpha(palette.divider, 0.7)}`,
          boxShadow: baseShadow,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#0f172a', 0.92),
          borderTop: `1px solid ${alpha(palette.divider, 0.6)}`,
          boxShadow: '0 -12px 28px rgba(2, 12, 27, 0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
