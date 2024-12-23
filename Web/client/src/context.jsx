import { createContext, useState } from "react";
import { SignupPopup } from "./components/SignupPopup";
export const SIGNUP_CONTEXT = createContext({
  signupOpen: false,
  setSignupOpen: () => {},
});

export function ContextWrapper({ children }) {
  const [signupOpen, setSignupOpen] = useState(false);
  return (
    <SIGNUP_CONTEXT.Provider value={{ signupOpen, setSignupOpen }}>
      {children}
      <SignupPopup />
    </SIGNUP_CONTEXT.Provider>
  );
}
