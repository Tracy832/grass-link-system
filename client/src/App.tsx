import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import MemberLogin from './features/member/MemberLogin';
import SignUp from './features/member/SignUp';
import AdminLogin from './features/admin/AdminLogin';

// Dashboards
import MemberDashboard from './features/member/MemberDashboard';
import AdminDashboard from './features/admin/AdminDashboard';

// Components & Layouts
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES */}
      <Route path="/login" element={<MemberLogin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/auth" element={<AdminLogin />} />

      {/* 2. MEMBER PROTECTED ROUTES */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute roleRequired="member">
            <MemberDashboard />
          </ProtectedRoute>
        } 
      />

      {/* 3. ADMIN PROTECTED ROUTES */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute roleRequired="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* 4. DEFAULT REDIRECTS */}
      {/* Send root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Fallback for 404s */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;