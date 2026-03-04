import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import UserDashboard from './features/dashboard/UserDashboard';
import TeamTree from './features/dashboard/TeamTree';
import Qualifications from './features/dashboard/Qualifications';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminLogin from './features/admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          {/* Member Side */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/tree" element={<ProtectedRoute><TeamTree /></ProtectedRoute>} />
          <Route path="/qualifications" element={<ProtectedRoute><Qualifications /></ProtectedRoute>} />

          {/* Admin Side */}
          <Route path="/admin/auth" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute isAdminRequired={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;