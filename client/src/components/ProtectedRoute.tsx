import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRequired = false }: { children: React.ReactNode, isAdminRequired?: boolean }) => {
  // Get the 'badge' from the browser's storage
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // If no one is logged in, go to Member Login
  if (!user) return <Navigate to="/" replace />;

  // If it's an Admin page but the badge says 'distributor', kick them out
  if (isAdminRequired && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;