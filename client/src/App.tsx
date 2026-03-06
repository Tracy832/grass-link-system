import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Member Features
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import DashboardLayout from './features/dashboard/DashboardLayout';
import Qualifications from './features/dashboard/Qualifications';
import TeamTree from './features/dashboard/TeamTree';

// Admin Features
import AdminLogin from './features/admin/AdminLogin';
import AdminDashboard from './features/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* PROTECTED MEMBER ROUTES (Nested under DashboardLayout) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* This renders at /dashboard */}
          <Route index element={
            <div className="p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Member Overview</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest">Welcome to Grass International</p>
            </div>
          } />
          
          {/* This renders at /dashboard/qualifications */}
          <Route path="qualifications" element={<Qualifications />} />
          
          {/* This renders at /dashboard/team */}
          <Route path="team" element={<TeamTree />} />
        </Route>

        {/* ADMIN GATEWAY */}
        <Route path="/admin/auth" element={<AdminLogin />} />
        
        {/* PROTECTED ADMIN DASHBOARD */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAdminRequired={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;