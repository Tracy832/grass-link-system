import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: 'admin' | 'member';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roleRequired }) => {
  const location = useLocation();
  
  // We check for the token and the role
  const token = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');

  // If there is no token, they aren't logged in
  if (!token) {
    const loginPath = roleRequired === 'admin' ? '/admin/auth' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If they have a token but the wrong role
  if (roleRequired && userRole !== roleRequired) {
    const fallback = userRole === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;