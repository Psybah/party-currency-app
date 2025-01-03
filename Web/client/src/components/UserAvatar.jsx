import React, { useContext, useEffect } from "react";
import { Avatar, Popover } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { USER_PROFILE_CONTEXT } from "@/context";
import { SIGNUP_CONTEXT } from "@/context";
import { deleteAuth } from "@/lib/util";
/**
 *
 * @param {boolean} showName show the name of the user
 * @param {boolean} auth give the user option to login or signup
 */
export default function UserAvatar({ showName, auth }) {
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUserProfile(null);
    deleteAuth();
    navigate("/");
  };
  useEffect(() => {
    console.log("user Profile changed", userProfile);
  }, [userProfile]);
  let name = userProfile && userProfile.firstname;

  const options = (
    <div>
      <ul className="space-y-2 mx-2 px-2 min-w-[10ch]">
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={() => {
            handleLogout();
          }}
        >
          Sign out
        </li>
      </ul>
    </div>
  );
  return userProfile ? (
    <span className="select-none">
      <Popover
        placement="bottom"
        content={options}
        style={{ backgroundColor: "#D4AF37" }}
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.5}
      >
        <div className="cursor-pointer">
          {showName ? (
            <div className="flex items-center bg-yellow-50 px-2 py-1.5 rounded-xl">
              <Avatar
                style={{
                  backgroundColor: "#334495",
                  verticalAlign: "middle",
                }}
                size="default"
              >
                <span className="font-semibold">{name[0]}</span>
              </Avatar>
              <span className="ml-2 font-semibold text-[#334495] algin-middle">
                {name}
              </span>
            </div>
          ) : (
            <Avatar
              style={{ backgroundColor: "#D6D979", verticalAlign: "middle" }}
              size="default"
            >
              <span className="font-semibold">{name[0]}</span>
            </Avatar>
          )}
        </div>
      </Popover>
    </span>
  ) : auth ? (
    <div className="md:flex items-center gap-6 hidden font-montserrat text-lg">
      <Link to="/login" className="hover:text-gold">
        Login
      </Link>
      <button
        className="bg-gold hover:bg-yellow-500 px-4 py-2 rounded-lg text-white"
        onClick={() => setSignupOpen(true)}
      >
        Sign Up
      </button>
    </div>
  ) : (
    <div></div>
  );
}
