/**
 * Per quest-type visual identity. Full class strings (not interpolated) so
 * Tailwind's content scanner picks them up.
 */
export type QuestTheme = {
  label: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
  glow: string;
};

const THEMES: Record<string, QuestTheme> = {
  COMMUNITY: {
    label: 'Community',
    text: 'text-violet',
    bg: 'bg-violet/10',
    border: 'border-violet/30',
    dot: 'bg-violet',
    glow: 'hover:shadow-glow',
  },
  WELLNESS: {
    label: 'Wellness',
    text: 'text-teal',
    bg: 'bg-teal/10',
    border: 'border-teal/30',
    dot: 'bg-teal',
    glow: 'hover:shadow-glow-teal',
  },
  TASK: {
    label: 'Task',
    text: 'text-gold',
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    dot: 'bg-gold',
    glow: 'hover:shadow-glow-gold',
  },
};

export const questTheme = (type?: string): QuestTheme =>
  THEMES[type ?? ''] ?? THEMES.TASK;
