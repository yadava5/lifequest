import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import {
  CardGiftcard as RewardsIcon,
  Description as ResumeIcon,
  Home as HomeIcon,
  List as QuestIcon,
  People as CommunityIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  MonetizationOn as CoinIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import { useQuestState } from '../features/quests/QuestContext';
import { useAuth } from '../features/auth/AuthContext';

const navItems = [
  { label: 'Home', value: '/', icon: <HomeIcon /> },
  { label: 'Quest Log', value: '/quests', icon: <QuestIcon /> },
  { label: 'Resume', value: '/resume', icon: <ResumeIcon /> },
  { label: 'Community', value: '/community', icon: <CommunityIcon /> },
  { label: 'Rewards', value: '/rewards', icon: <RewardsIcon /> },
];

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useQuestState();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const prefersTallLayout = useMediaQuery('(min-height: 820px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleChange = (_, value) => {
    if (!value) return;
    navigate(value);
  };

  const open = Boolean(anchorEl);
  const coins = user?.coins ?? 0;
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'LQ';

  const shellShadow = isDesktop ? '0 32px 80px rgba(2, 8, 23, 0.6)' : 'none';
  const appShellBackground = isDesktop
    ? alpha(theme.palette.background.paper, 0.88)
    : 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.92) 60%)';
  const accentBorder = isDesktop ? `1px solid ${alpha(theme.palette.divider, 0.65)}` : 'none';
  const deviceMetrics = useMemo(
    () => ({
      width: 430,
      height: prefersTallLayout ? 932 : undefined,
    }),
    [prefersTallLayout]
  );

  const currentNavValue = useMemo(() => {
    const match = navItems.find((item) =>
      item.value === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.value)
    );
    return match?.value ?? null;
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        py: { xs: 0, md: 4 },
        px: { xs: 0, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: isDesktop ? `${deviceMetrics.width}px` : '100%',
          height: isDesktop
            ? deviceMetrics.height
              ? `min(${deviceMetrics.height}px, 92vh)`
              : '92vh'
            : '100vh',
          maxHeight: isDesktop && deviceMetrics.height ? `${deviceMetrics.height}px` : '100vh',
          background: appShellBackground,
          borderRadius: isDesktop ? 32 : 0,
          border: accentBorder,
          boxShadow: shellShadow,
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          overflow: 'hidden',
          backdropFilter: isDesktop ? 'blur(18px)' : 'none',
          position: 'relative',
        }}
      >
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{
            backgroundColor: isDesktop ? alpha('#0f172a', 0.85) : 'rgba(2, 6, 23, 0.88)',
            backdropFilter: isDesktop ? 'blur(18px)' : 'none',
            borderBottom: isDesktop ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1.25, sm: 2 }, minHeight: 64 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                backgroundColor: alpha(theme.palette.primary.main, 0.22),
                px: 1,
                py: 0.5,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              <CoinIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
              {loading ? (
                <CircularProgress size={16} sx={{ color: theme.palette.primary.main }} />
              ) : (
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {coins} Coins
                </Typography>
              )}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
              LifeQuest
            </Typography>
            <IconButton
              aria-label="Profile menu"
              data-testid="profile-menu-button"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ p: 0.25 }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: alpha(theme.palette.primary.light ?? theme.palette.primary.main, 0.22),
                  color: theme.palette.primary.contrastText,
                  fontWeight: 600,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                data-testid="profile-menu-settings"
                onClick={() => {
                  setAnchorEl(null);
                  navigate('/settings');
                }}
              >
                <SettingsIcon fontSize="small" sx={{ mr: 1 }} /> Settings
              </MenuItem>
              <MenuItem
                data-testid="profile-menu-logout"
                onClick={() => {
                  setAnchorEl(null);
                  logout();
                  navigate('/login');
                }}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            overflowY: 'auto',
            background: isDesktop
              ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.18) 0%, rgba(2, 6, 23, 0.55) 100%)'
              : 'transparent',
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 2.25, sm: 3 },
            scrollBehavior: 'smooth',
          }}
        >
          {children}
        </Box>

        <BottomNavigation
          showLabels
          value={currentNavValue}
          onChange={handleChange}
          sx={{
            borderTop: isDesktop ? `1px solid ${alpha(theme.palette.divider, 0.5)}` : 'none',
            backgroundColor: isDesktop ? alpha('#0f172a', 0.88) : 'rgba(2, 6, 23, 0.92)',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 0,
              paddingX: 1,
              color: alpha(theme.palette.text.secondary, 0.85),
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction key={item.value} label={item.label} value={item.value} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default AppLayout;
