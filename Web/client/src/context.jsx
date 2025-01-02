import { createContext, useState } from "react";
import { SignupPopup } from "./components/SignupPopup";
import { InitializeApp } from "./components/IntitializeApp";
export const SIGNUP_CONTEXT = createContext({
  signupOpen: false,
  setSignupOpen: () => {},
});
export const USER_PROFILE_CONTEXT = createContext({
  userProfile: null,
  setUserProfile: () => {},
});
export function ContextWrapper({ children }) {
  const [signupOpen, setSignupOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  return (
    <USER_PROFILE_CONTEXT.Provider value={{ userProfile, setUserProfile }}>
      <SIGNUP_CONTEXT.Provider value={{ signupOpen, setSignupOpen }}>
        {children}
        <SignupPopup />
        <InitializeApp />
      </SIGNUP_CONTEXT.Provider>
    </USER_PROFILE_CONTEXT.Provider>
  );
}
