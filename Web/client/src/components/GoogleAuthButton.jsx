import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { USER_PROFILE_CONTEXT } from "@/context";
import { storeAuth } from "@/lib/util";
import { BASE_URL } from "@/config";
import toast from "react-hot-toast";

export function GoogleAuthButton() {
  const navigate = useNavigate();
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/google/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: response.credential,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        storeAuth(data.token, "customer", true);
        setUserProfile(data.user);
        navigate("/dashboard");
        toast.success("Successfully logged in with Google!");
      } else {
        throw new Error(data.message || "Failed to authenticate with Google");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error(error.message || "Failed to authenticate with Google");
    }
  };

  const initializeGoogleAuth = () => {
    toast.error("Google authentication is not configured yet. Please use email/password login.");
  };

  return (
    <button
      onClick={initializeGoogleAuth}
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
    >
      <img src="/google.svg" alt="Google" className="h-5 w-5" />
      Continue with Google
    </button>
  );
}