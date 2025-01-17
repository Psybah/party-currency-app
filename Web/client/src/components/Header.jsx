import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/main_logo.svg";
import { SIGNUP_CONTEXT } from "../context.jsx";
import UserAvatar from "./UserAvatar";
import { MobileMenu } from "./navigation/MobileMenu";
import { DesktopNav } from "./navigation/DesktopNav";

const WithoutHeader = [
  "/login",
  "/celebrant-signup",
  "/merchant-signup",
  "/forgot-password",
  "/terms",
  "/dashboard",
  "/create-event",
  "/manage-event",
  "/templates",
  "/settings",
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  React.useEffect(() => {
    const body = document.body;
    if (isMenuOpen) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
    return () => {
      body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  const handlePopUpToggle = () => {
    setSignupOpen(true);
  };

  if (WithoutHeader.includes(location.pathname)) return null;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-2 md:px-5 text-white 
        transition-all duration-300 
        ${
          isScrolled
            ? "bg-bluePrimary bg-opacity-30 backdrop-blur-sm shadow-md"
            : ""
        }`}
    >
      <div className="flex justify-between items-center px-4 md:px-7 py-4 w-full">
        <Link to="/" className="w-28">
          <img src={logo} alt="Party Currency Logo" />
        </Link>

        <div
          className="md:hidden cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </div>

        <DesktopNav
          location={location}
          scrollToSection={scrollToSection}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />

        <UserAvatar auth={true} showName={true} />
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isMobileDropdownOpen={isMobileDropdownOpen}
        setIsMobileDropdownOpen={setIsMobileDropdownOpen}
        scrollToSection={scrollToSection}
        handlePopUpToggle={handlePopUpToggle}
        location={location}
      />
    </header>
  );
};

export default Header;