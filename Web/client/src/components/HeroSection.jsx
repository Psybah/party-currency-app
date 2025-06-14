import React from "react";
import { useContext } from "react";
import { SIGNUP_CONTEXT, USER_PROFILE_CONTEXT } from "../context";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/bg_image.png";

const HeroSection = () => {
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (userProfile?.type?.toLowerCase() === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <section
      id="hero-section"
      className="relative h-screen flex flex-col justify-center items-center text-center text-white"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-softBlue to-gold opacity-80"></div>

      {/* Content */}
      <div className="relative z-10 px-6">
        {/* Welcome Message */}
        <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-montserrat font-semibold tracking-wider mb-6 animate-fadeIn">
          {userProfile
            ? `Welcome ${userProfile.firstname}!`
            : "MAKE IT RAIN WITH PARTY CURRENCY!"}
        </h1>

        {/* Main Heading */}
        <h2
          className="font-bold text-4xl sm:text-5xl 
        md:text-6xl lg:text-7xl font-playfair 
        bg-clip-text text-transparent 
        bg-gradient-to-r from-gold
        via-gradientWhite2 to-gradientWhite3"
        >
          What's the Generous Sum <br className="hidden sm:block" /> Coming Your
          Way?
        </h2>

        {/* Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          {userProfile ? (
            <button
              onClick={handleDashboardClick}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg bg-gold text-white rounded-lg sm:rounded-xl shadow-md hover:bg-yellow-500 transition-all"
            >
              Visit Dashboard
            </button>
          ) : (
            <button
              onClick={() => setSignupOpen(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg bg-gold text-white rounded-lg sm:rounded-xl shadow-md hover:bg-yellow-500 transition-all"
            >
              Get Party Currency
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
