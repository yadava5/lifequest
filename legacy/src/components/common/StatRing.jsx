import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

const StatRing = ({ value, label, subtitle, color, size = 100, thickness = 4 }) => {
  const theme = useTheme();
  const ringColor = color ?? theme.palette.primary.main;
  const trackColor = alpha(theme.palette.primary.main, 0.2);

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            color: trackColor,
            zIndex: 0,
          }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={thickness}
          sx={{
            position: 'relative',
            zIndex: 1,
            color: ringColor,
            filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.35))',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
            '& .MuiCircularProgress-circleDeterminate': {
              stroke: ringColor,
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Box>
      </Box>
      {subtitle && (
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default StatRing;
