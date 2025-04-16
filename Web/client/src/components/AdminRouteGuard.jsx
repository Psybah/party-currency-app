import { Navigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { USER_PROFILE_CONTEXT } from '@/context';

export function AdminRouteGuard({ children }) {
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const location = useLocation();
  
  // Check if user is logged in and is an admin
  const isAdmin = userProfile?.type?.toLowerCase() === 'admin';
  
  useEffect(() => {
    console.log('AdminRouteGuard - userProfile:', userProfile);
    console.log('AdminRouteGuard - isAdmin:', isAdmin);
  }, [userProfile, isAdmin]);

  if (!userProfile || !isAdmin) {
    // Redirect to login if not authenticated or not an admin
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
} 