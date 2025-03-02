
import React from "react";

export function TermsAndConditions() {
  return (
    <div className="text-center text-sm">
      By clicking "Create an Account" above, you acknowledge that you have
      read, understood, and agree to Party Currency's{" "}
      <a href="/terms" className="text-gold hover:underline">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="/privacy" className="text-gold hover:underline">
        Privacy Policy
      </a>
      .
    </div>
  );
}
