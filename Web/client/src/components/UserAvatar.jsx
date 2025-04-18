import React, { useContext, useEffect } from "react";
import { Avatar, Popover } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { USER_PROFILE_CONTEXT } from "@/context";
import { SIGNUP_CONTEXT } from "@/context";
import { deleteAuth, getAuth } from "@/lib/util";

export default function UserAvatar({ showName, auth, merchantLinks }) {
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const navigate = useNavigate();
  const { userType } = getAuth();
  const isMerchant = userType === "merchant";

  const handleLogout = () => {
    setUserProfile(null);
    deleteAuth();
    navigate("/");
  };

  useEffect(() => {
    console.log("user Profile changed", userProfile);
  }, [userProfile]);

  // Check auth status on mount and when userProfile changes
  useEffect(() => {
    if (auth && !userProfile) {
      // If auth is required but no user profile exists, redirect to login
      navigate('/login');
    }
  }, [auth, userProfile, navigate]);

  // If auth is required and no user profile exists, don't render anything
  if (auth && !userProfile) {
    return null;
  }

  let name = userProfile && userProfile.firstname;

  // Different options for merchant dashboard
  const merchantOptions = (
    <div>
      <ul className="space-y-2 mx-2 px-2 min-w-[10ch]">
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={() => {
            navigate("/merchant/transactions");
          }}
        >
          Transactions
        </li>
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={() => {
            navigate("/merchant/settings");
          }}
        >
          Settings
        </li>
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={handleLogout}
        >
          Sign out
        </li>
      </ul>
    </div>
  );

  // Regular customer/celebrant options
  const regularOptions = (
    <div>
      <ul className="space-y-2 mx-2 px-2 min-w-[10ch]">
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Dashboard
        </li>
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={() => {
            navigate("/settings");
          }}
        >
          Settings
        </li>
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={handleLogout}
        >
          Sign out
        </li>
      </ul>
    </div>
  );

  // Select appropriate options based on whether this is for merchant or regular user
  const options = isMerchant ? merchantOptions : regularOptions;

  return userProfile ? (
    <span className="select-none">
      <Popover
        placement="bottom"
        content={options}
        style={{ backgroundColor: "bluePrimary" }}
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.5}
      >
        <div className="flex items-center gap-2 font-semibold cursor-pointer">
          {showName && (
            <>
              <span className="hidden md:inline text-paragraph">Hello,</span>
              <span className="hidden md:inline text-paragraph">{name}</span>
            </>
          )}
          <Avatar
            style={{ backgroundColor: "#334495", verticalAlign: "middle" }}
            size="default"
          >
            <span className="font-semibold text-white">{name?.[0]}</span>
          </Avatar>
        </div>
      </Popover>
    </span>
  ) : auth ? (
    <div className="hidden md:flex items-center gap-6 font-montserrat text-lg">
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
