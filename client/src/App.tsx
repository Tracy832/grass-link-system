import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import MemberLogin from './features/member/MemberLogin';
import SignUp from './features/member/SignUp';
import AdminLogin from './features/admin/AdminLogin';
import MemberDashboard from './features/member/MemberDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import TeamTree from './features/member/TeamTree';
import Qualifications from './features/member/Qualifications';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<MemberLogin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/auth" element={<AdminLogin />} />

      {/* Member Routes - All protected by 'member' role */}
      <Route path="/dashboard" element={
        <ProtectedRoute roleRequired="member">
          <MemberDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/tree" element={
        <ProtectedRoute roleRequired="member">
          <TeamTree />
        </ProtectedRoute>
      } />
      
      <Route path="/rules" element={
        <ProtectedRoute roleRequired="member">
          <Qualifications />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute roleRequired="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Redirects: If a path doesn't exist, send to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;