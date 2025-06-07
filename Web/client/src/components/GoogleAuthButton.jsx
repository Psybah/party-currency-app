import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { USER_PROFILE_CONTEXT } from "@/context";
import { storeAuth } from "@/lib/util";
import { BASE_URL } from "@/config";
import { googleAuthUrl } from "@/config";
import toast from "react-hot-toast";

export function GoogleAuthButton() {
  const navigate = useNavigate();
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);

  return (
    <button
      onClick={() => (window.location.href = googleAuthUrl)}
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
    >
      <img src="/google.svg" alt="Google" className="h-5 w-5" />
      Continue with Google
    </button>
  );
}
