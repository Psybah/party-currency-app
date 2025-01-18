import { Navigate } from "react-router-dom";
import { useAuthenticated } from "../lib/hooks";
import { useContext, useEffect } from "react";
import { USER_PROFILE_CONTEXT } from "@/context";
import { getAuth } from "@/lib/util";
import { getProfileApi } from "@/services/apiAuth";

export default function PrivateRoute({ children }) {
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const authenticated = useAuthenticated();

  useEffect(() => {
    const initializeUser = async () => {
      const { accessToken } = getAuth();
      
      if (accessToken && !userProfile) {
        try {
          const response = await getProfileApi();
          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData);
            console.log("User profile initialized:", userData);
          }
        } catch (error) {
          console.error("Failed to initialize user:", error);
        }
      }
    };

    initializeUser();
  }, [userProfile, setUserProfile]);

  if (!authenticated && !userProfile) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  return children;
}