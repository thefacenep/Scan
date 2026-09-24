import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import FeedbackForm from './components/FeedbackForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import QRPrint from './components/QRPrint';
import PreviousComplaintsDropdown from './components/PreviousComplaintsDropdown';

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
        <Routes>
          <Route path="/" element={<FeedbackForm />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/qr-print" element={<QRPrint />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* Previous Complaints Dropdown - appears on all public pages */}
        <PreviousComplaintsDropdown />
      </LanguageProvider>
    </BrowserRouter>
  );
}
