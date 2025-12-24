import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppProviders from './AppProviders';
import AppLayout from './AppLayout';
import AppRoutes from './AppRoutes';
import RequireAuth from '../features/auth/RequireAuth';
import LoginPage from '../pages/Auth/LoginPage';

const AuthenticatedApp = () => (
  <RequireAuth>
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  </RequireAuth>
);

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AuthenticatedApp />} />
      </Routes>
    </BrowserRouter>
  </AppProviders>
);

export default App;
