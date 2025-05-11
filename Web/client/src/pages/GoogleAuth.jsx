import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { USER_PROFILE_CONTEXT } from "@/context";
import { storeAuth } from "@/lib/util";
import { getProfileApi } from "@/api/authApi";
import toast from "react-hot-toast";

export default function GoogleAuth() {
  const navigate = useNavigate();
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get token and user type from URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const userType = urlParams.get("user");

        if (!token) {
          setStatus("Authentication failed. No token received.");
          toast.error("Authentication failed");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Store authentication token and user type
        storeAuth(token, userType.toLowerCase(), true);
        setStatus("Authentication successful. Loading your profile...");

        // Fetch user profile with the new token
        const response = await getProfileApi();
        
        if (!response.ok) {
          throw new Error("Unable to fetch profile");
        }
        
        const profile = await response.json();
        setUserProfile(profile);
        
        // Success message
        toast.success("Successfully signed in with Google!");
        
        navigate("/");
      } catch (error) {
        console.error("Google auth callback error:", error);
        setStatus("Authentication error. Please try again.");
        toast.error("Failed to complete authentication");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleGoogleCallback();
  }, [navigate, setUserProfile]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img 
            src="/logo.svg" 
            alt="Party Currency" 
            className="mx-auto h-14 w-auto" 
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Google Sign In
          </h2>
          <div className="mt-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <p className="mt-3 text-gray-600">{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 