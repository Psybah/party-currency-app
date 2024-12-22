import {createContext} from 'react';
import SignupPopover from '../components/SignupPopover';
export const SIGNUP_MODAL = createContext({});

export function contextWrapper({children}) {
  const [signupOpen, setSignupOpen] = useState(false);
  return (
    <SIGNUP_MODAL.Provider value={{signupOpen, setSignupOpen}}>
      <SignupPopover/>
      {children}
    </SIGNUP_MODAL.Provider>
  );
}