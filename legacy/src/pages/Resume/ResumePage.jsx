import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { alpha, useTheme } from '@mui/material/styles';

const aiPrompts = [
  "Draft a 3-sentence summary that highlights my most recent achievements in marketing.",
  "List bullet points that quantify my impact as an operations manager in terms of cost savings.",
  "Reframe a 6-month employment gap as purposeful professional development.",
];

const quickTips = [
  'Lead bullets with strong action verbs and quantify the outcome (e.g., “Increased retention by 18%”).',
  'Keep the document concise—one page for early career, two for experienced professionals.',
  'Mirror keywords from target job listings to improve applicant tracking visibility.',
];

const ResumePage = () => {
  const theme = useTheme();
  const accent = alpha(theme.palette.primary.main, 0.08);

  return (
    <Box sx={{ p: 0, display: 'grid', gap: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        Resume Boost
      </Typography>
      <Alert severity="info">
        LifeQuest’s AI resume assistant is coming soon. For now, use the guided prompts below with your favourite AI tool and paste updated content into the quests that earn coins.
      </Alert>

      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Paste resume notes (optional)"
              placeholder="Keep a scratchpad of achievements you want to polish later."
              multiline
              minRows={8}
              fullWidth
              InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                },
              }}
            />
            <Button
              variant="contained"
              disabled
              sx={{
                alignSelf: 'flex-start',
                background: alpha(theme.palette.text.secondary, 0.3),
                color: theme.palette.text.disabled,
              }}
            >
              Insights coming soon
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
            Prompts to try
          </Typography>
          <List dense>
            {aiPrompts.map((prompt) => (
              <ListItem key={prompt} sx={{ pl: 0, borderRadius: 2, px: 1, '&:hover': { backgroundColor: accent } }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText primary={prompt} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
            Quick wins
          </Typography>
          <List dense>
            {quickTips.map((tip) => (
              <ListItem key={tip} sx={{ pl: 0, borderRadius: 2, px: 1, '&:hover': { backgroundColor: accent } }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                </ListItemIcon>
                <ListItemText primary={tip} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResumePage;
