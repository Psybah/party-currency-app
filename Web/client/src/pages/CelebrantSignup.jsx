import React, { useState } from "react";
import { AuthFormWrapper } from "@/components/forms/AuthFormWrapper";
import { CelebrantSignupForm } from "@/components/celebrant/CelebrantSignupForm";
import { LoadingDisplay } from "@/components/LoadingDisplay";

export default function CelebrantSignupPage() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <LoadingDisplay />;
  }

  return (
    <AuthFormWrapper
      title="Sign up as Host/Event planner"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkPath="/login"
    >
      <CelebrantSignupForm />
    </AuthFormWrapper>
  );
}
