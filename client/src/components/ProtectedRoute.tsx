import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: 'admin' | 'member';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roleRequired }) => {
  const authValue = localStorage.getItem('isAuthenticated');
  const isAuthenticated = authValue === 'true';
  const userRole = localStorage.getItem('userRole') as 'admin' | 'member' | null;

  // DEBUGGING: Open your browser console (F12) to see these
  console.log("--- GUARD CHECK ---");
  console.log("Auth in Storage:", authValue);
  console.log("User Role:", userRole);
  console.log("Page Requires:", roleRequired);

  // 2. If NO ID card is found
  if (!isAuthenticated) {
    console.warn("GUARD: Not authenticated. Redirecting to login.");
    const loginPath = roleRequired === 'admin' ? '/admin/auth' : '/login';
    return <Navigate to={loginPath} replace />;
  }

  // 3. Role Mismatch
  if (roleRequired && userRole !== roleRequired) {
    console.warn(`GUARD: Role mismatch. User is ${userRole}, but page needs ${roleRequired}.`);
    const fallback = userRole === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;