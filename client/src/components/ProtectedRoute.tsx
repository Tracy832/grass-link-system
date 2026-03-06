import React, { type ReactNode } from 'react'; // Added the 'type' keyword
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  isAdminRequired?: boolean;
}

const ProtectedRoute = ({ children, isAdminRequired = false }: ProtectedRouteProps) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isAdminRequired && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;