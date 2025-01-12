import { useContext, useState, useEffect } from "react";
import { USER_PROFILE_CONTEXT } from "@/context";
import { useNavigate } from "react-router-dom";
// tells if a user is authenticated else auto redirects user to login after timeout
export function useAuthenticated(timeout = 5000) {
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    let Timeout = null;
    if (!userProfile) {
      Timeout = setTimeout(() => {
        setAuthenticated(false);
        navigate("/login");
      }, timeout);
    } else {
      setAuthenticated(true);
    }
    return () => {
      if (Timeout) {
        clearTimeout(Timeout);
      }
    };
  }, [userProfile, navigate, timeout]);
  return authenticated;
}
