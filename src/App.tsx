import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { FeedbackProvider } from './context/FeedbackContext';
import FeedbackForm from './components/FeedbackForm';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import TrackingPage from './components/TrackingPage';
import QRPrint from './components/QRPrint';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem('iro-admin-auth') === 'true';
  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <FeedbackProvider>
          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/track" element={<TrackingPage />} />
            <Route path="/qr-print" element={<QRPrint />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </FeedbackProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
