import React from "react";
import { Button } from "@/components/ui/button";

export function SocialAuthButtons() {
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

      <div className="gap-4 grid grid-cols-2">
        <Button variant="outline" className="border-lightgray">
          <img src="/google.svg" alt="Google" className="mr-2 w-5 h-5" />
          Google
        </Button>
        <Button variant="outline" className="border-lightgray">
          <img src="/apple.svg" alt="Apple" className="mr-2 w-5 h-5" />
          Apple
        </Button>
      </div>
    </div>
  );
}