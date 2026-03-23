import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MemberLogin from './features/member/MemberLogin';
import SignUp from './features/member/SignUp';
import AdminLogin from './features/admin/AdminLogin';
import MemberDashboard from './features/member/MemberDashboard';
import AdminDashboard from './features/admin/AdminDashboard';
import TeamTree from './features/member/TeamTree';
import Qualifications from './features/member/Qualifications';
import MemberProfile from './features/member/MemberProfile'; 
import ProtectedRoute from './components/ProtectedRoute';
import AdminPromotions from './features/admin/components/AdminPromotions'; 
import PromotionsCenter from './features/member/PromotionsCenter'; 

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<MemberLogin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin/auth" element={<AdminLogin />} />

      {/* Standardized Member Paths */}
      <Route path="/dashboard" element={<ProtectedRoute roleRequired="member"><MemberDashboard /></ProtectedRoute>} />
      <Route path="/tree" element={<ProtectedRoute roleRequired="member"><TeamTree /></ProtectedRoute>} />
      <Route path="/qualifications" element={<ProtectedRoute roleRequired="member"><Qualifications /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute roleRequired="member"><MemberProfile /></ProtectedRoute>} />
      
      {/* 🚨 NEW: Member Promotions Center */}
      <Route path="/promotions" element={<ProtectedRoute roleRequired="member"><PromotionsCenter /></ProtectedRoute>} />

      {/* Standardized Admin Paths */}
      <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><AdminDashboard /></ProtectedRoute>} />
      
      {/* 🚨 NEW: Admin Promotions Manager */}
      <Route path="/admin/promotions" element={<ProtectedRoute roleRequired="admin"><AdminPromotions /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;