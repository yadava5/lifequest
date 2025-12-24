import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { HomeScreen } from '@/screens/HomeScreen';
import { QuestsScreen } from '@/screens/QuestsScreen';
import { RewardsScreen } from '@/screens/RewardsScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { ResumeScreen } from '@/screens/ResumeScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { AuthGate } from '@/features/auth/AuthGate';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: 'quests', element: <QuestsScreen /> },
      { path: 'rewards', element: <RewardsScreen /> },
      { path: 'community', element: <CommunityScreen /> },
      { path: 'resume', element: <ResumeScreen /> },
      { path: 'settings', element: <SettingsScreen /> },
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <AuthGate>
        <RouterProvider router={router} />
      </AuthGate>
    </ThemeProvider>
  );
}
