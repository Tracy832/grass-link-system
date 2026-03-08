import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: 'admin' | 'member';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roleRequired }) => {
  // 1. Read the "ID Card" from the browser
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole'); // 'admin' or 'member'

  // 2. If NO ID card is found, kick them to the correct login page
  if (!isAuthenticated) {
    const loginPath = roleRequired === 'admin' ? '/admin/auth' : '/login';
    return <Navigate to={loginPath} replace />;
  }

  // 3. If they have a Member ID but try to enter the Admin door (or vice versa)
  if (roleRequired && userRole !== roleRequired) {
    // Send them back to their own home base
    const fallback = userRole === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  // 4. Everything looks good! Let them in.
  return <>{children}</>;
};

export default ProtectedRoute;