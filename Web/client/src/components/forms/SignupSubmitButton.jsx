import React from "react";
import { Button } from "@/components/ui/button";

export function SignupSubmitButton({ loading, text = "Create an account" }) {
  return (
    <Button
      type="submit"
      className="bg-[#1A1A1A] hover:bg-[#2D2D2D] w-full text-white"
      disabled={loading}
    >
      {loading ? "Creating account..." : text}
    </Button>
  );
}
