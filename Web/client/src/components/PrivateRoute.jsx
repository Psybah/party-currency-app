
import { Navigate } from "react-router-dom";
import { getAuth } from "@/lib/util";

export default function PrivateRoute({ children, userType }) {
  const { accessToken, userType: currentUserType } = getAuth();

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  // Redirect to appropriate dashboard if user type doesn't match
  if (userType && userType !== currentUserType) {
    return <Navigate to={currentUserType === "merchant" ? "/merchant/dashboard" : "/dashboard"} />;
  }

  return children;
}
