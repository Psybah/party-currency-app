import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminAuth } from '@/lib/admin-auth';

export function AdminProtectedRoute({ children }) {
  const { isAuthenticated } = getAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
