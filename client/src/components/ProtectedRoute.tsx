import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: 'admin' | 'member';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roleRequired }) => {
  // 1. Check if user is logged in (using localStorage for now)
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole'); // 'admin' or 'member'

  // 2. If not logged in, send to login page
  if (!isAuthenticated) {
    const redirectPath = roleRequired === 'admin' ? '/admin/auth' : '/login';
    return <Navigate to={redirectPath} replace />;
  }

  // 3. If logged in but wrong role, send to their respective home
  if (roleRequired && userRole !== roleRequired) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  // 4. Everything is fine, show the page
  return <>{children}</>;
};

export default ProtectedRoute;