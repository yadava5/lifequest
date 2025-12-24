import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import QuestLogPage from '../pages/QuestLog/QuestLogPage';
import ResumePage from '../pages/Resume/ResumePage';
import SocialPage from '../pages/Social/SocialPage';
import RewardsPage from '../pages/Rewards/RewardsPage';
import SettingsPage from '../pages/Settings/SettingsPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/quests" element={<QuestLogPage />} />
    <Route path="/resume" element={<ResumePage />} />
    <Route path="/community" element={<SocialPage />} />
    <Route path="/rewards" element={<RewardsPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
