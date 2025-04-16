import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "@/lib/util";
import { USER_PROFILE_CONTEXT } from "@/context";

export function AdminProtectedRoute({ children }) {
  const { accessToken, userType } = getAuth();
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const location = useLocation();

  console.log('AdminProtectedRoute - userType:', userType);
  console.log('AdminProtectedRoute - userProfile:', userProfile);

  if (!accessToken || !userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check both userType from auth and userProfile type
  const isAdmin = userType === "admin" && userProfile?.type?.toLowerCase() === "admin";
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
