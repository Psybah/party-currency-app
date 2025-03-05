
import { useState } from "react";
import { AuthFormWrapper } from "@/components/forms/AuthFormWrapper";
import { MerchantSignupForm } from "@/components/merchant/MerchantSignupForm";
import { LoadingDisplay } from "@/components/LoadingDisplay";

export default function MerchantSignup() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <LoadingDisplay />;
  }

  return (
    <AuthFormWrapper
      title="Sign up as merchant"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkPath="/login"
    >
      <MerchantSignupForm />
    </AuthFormWrapper>
  );
}
