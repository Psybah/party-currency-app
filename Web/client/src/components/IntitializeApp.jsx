import { useEffect, useContext } from "react";
import { USER_PROFILE_CONTEXT } from "@/context";
import { getProfileApi } from "@/api/authApi";
import { getAuth } from "@/lib/util";

export function InitializeApp({ children }) {
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);

  useEffect(() => {
    const { accessToken } = getAuth();
    if (accessToken) {
      getProfileApi()
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to fetch profile");
          }
          return response.json();
        })
        .then((profile) => {
          setUserProfile(profile);
        })
        .catch((error) => {
          console.error("Profile fetch error:", error);
        });
    }
  }, []);

  return <div>{children}</div>;
}
