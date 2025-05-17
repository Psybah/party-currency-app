import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Avatar, Popover } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { USER_PROFILE_CONTEXT } from "@/context";
import { SIGNUP_CONTEXT } from "@/context";
import { deleteAuth, getAuth } from "@/lib/util";
import { getProfilePicture } from "@/api/profileApi";
import { getDriveImage } from "@/api/utilApi";

export default function UserAvatar({ showName = false }) {
  const { userProfile, setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const navigate = useNavigate();
  const { userType } = getAuth();
  const isMerchant = userType === "merchant";
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const data = await getProfilePicture();
        if (data && data.profile_picture) {
          const objectUrl = await getDriveImage(data.profile_picture);
          setProfileImage(objectUrl);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    if (userProfile) {
      fetchProfilePicture();
    }
  }, [userProfile]);

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (profileImage && profileImage.startsWith('blob:')) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const handleLogout = () => {
    setUserProfile(null);
    deleteAuth();
    navigate("/");
  };

  // Different options for merchant dashboard
  const merchantOptions = (
    <div>
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">{userProfile?.email}</p>
      </div>
      <ul className="space-y-2 mx-2 px-2 min-w-[10ch]">
        <li
          className="hover:font-semibold hover:text-Primary transition-colors cursor-pointer select-none"
          onClick={() => {
            navigate("/merchant/virtual-account");
          }}
        >
          Virtual Account
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
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">{userProfile?.email}</p>
      </div>
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

  // If there's a user profile, show the avatar and options
  if (userProfile) {
    const name = userProfile.firstname;
    return (
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
              src={profileImage}
              style={{ backgroundColor: "#334495", verticalAlign: "middle" }}
              size="default"
            >
              {!profileImage && <span className="font-semibold text-white">{name?.[0]}</span>}
            </Avatar>
          </div>
        </Popover>
      </span>
    );
  }

  // If no user profile, show login/signup buttons
  return (
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
  );
}

UserAvatar.propTypes = {
  showName: PropTypes.bool
};
