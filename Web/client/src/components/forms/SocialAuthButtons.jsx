import React from "react";
import { Button } from "@/components/ui/button";
import { googleAuthUrl } from "@/config";
export function SocialAuthButtons() {
  const handleGoogleLogin = () => {
    // Redirect to the backend's Google auth URL
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="border-t border-lightgray w-full"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-lightgray"
        onClick={handleGoogleLogin}
      >
        <img src="/google.svg" alt="Google" className="mr-2 w-5 h-5" />
        Continue with Google
      </Button>
    </div>
  );
}
