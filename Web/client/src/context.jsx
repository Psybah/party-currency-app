import {createContext, useState} from 'react';
export const SIGNUP_MODAL = createContext({});

export function ContextWrapper({children}) {
  const [signupOpen, setSignupOpen] = useState(false);
  return (
    <SIGNUP_MODAL.Provider value={{signupOpen, setSignupOpen}}>
      
      {children}
    </SIGNUP_MODAL.Provider>
  );
}