import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "@/lib/util";

export function AdminProtectedRoute({ children }) {
  const { accessToken, userType } = getAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Verify that the user is specifically an admin
  if (userType !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
