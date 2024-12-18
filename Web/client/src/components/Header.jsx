import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/main_logo.svg";
import { SignupPopup } from './SignupPopup'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const location = useLocation();

  // Handle scroll to add/remove background
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll to sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Prevent body scrolling when menu is open
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

   // Show/hide pop-up
   const handlePopUpToggle = () => {
    setIsPopUpOpen(!isPopUpOpen);
   };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-2 md:px-5 text-white 
        transition-all duration-300 
        ${isScrolled 
          ? "bg-bluePrimary bg-opacity-30 backdrop-blur-sm shadow-md" 
          : ""}`}>

      <div className="flex justify-between px-7 py-4 items-center w-full">
        {/* Logo */}
        <Link to="/" className="w-28">
          <img src={logo} alt="Party Currency Logo" />
        </Link>

        {/* Burger Icon for Mobile */}
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

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 items-center font-montserrat text-lg">
          <button
            className="hover:text-gold"
            onClick={() => scrollToSection("hero-section")}
          >
            Home
          </button>
          {location.pathname === "/" ? (
            <button
              className="hover:text-gold"
              onClick={() => scrollToSection("about")}
            >
              About Us
            </button>
          ) : (
            <Link to="/#about" className="hover:text-gold">
              About Us
            </Link>
          )}
          <div
            className="relative flex items-center gap-1">
            {/* "Features" link navigates to the "Features" section */}
            <button
              className="hover:text-gold"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>

            {/* Chevron toggles the dropdown */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-5 h-5 transform ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              } cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent click on chevron from triggering link navigation
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-4 bg-bluePrimary 
                              bg-opacity-50 backdrop-blur-xl shadow-md
                              text-white w-60 rounded-md">
                <button
                  className="block w-full text-left px-4 py-4 hover:bg-gray-100 hover:text-gold"
                  onClick={() => scrollToSection("custom-currency")}
                >
                  Custom Currency
                </button>
                <button
                  className="block w-full text-left px-4 py-4 hover:bg-gray-100 hover:text-gold"
                  onClick={() => scrollToSection("reconciliation-service")}
                >
                  Reconciliation Service
                </button>
                <button
                  className="block w-full text-left px-4 py-4 hover:bg-gray-100 hover:text-gold"
                  onClick={() => scrollToSection("vendor-kiosk-system")}
                >
                  Vendor Kiosk System
                </button>
                <button
                  className="block w-full text-left px-4 py-4 hover:bg-gray-100 hover:text-gold"
                  onClick={() => scrollToSection("foot-soldiers")}
                >
                  Foot Soldiers
                </button>
              </div>
            )}
          </div>
          <button
            className="hover:text-gold"
            onClick={() => scrollToSection("contact")}
          >
            Contact Us
          </button>
        </nav>

        {/* Login and Signup */}
        <div className="hidden md:flex gap-6 items-center font-montserrat text-lg">
          <Link to="/login" className="hover:text-gold">
            Login
          </Link>
          <button
            className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-yellow-500"
            onClick={handlePopUpToggle}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* SignupPopup */}
      <SignupPopup isOpen={isPopUpOpen} onClose={handlePopUpToggle} />

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu-panel"
        className={`fixed top-0 right-0 w-1/2 h-screen bg-bluePrimary 
          bg-opacity-90 backdrop-blur-sm z-40 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-white cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-6 mt-10 px-6">
          {location.pathname === "/" ? (
            <button
              className="text-white text-lg block text-left"
              onClick={() => scrollToSection("hero-section")}
            >
              Home
            </button>
          ) : (
            <button
              className="text-white text-lg block"
              onClick={() => scrollToSection("hero-section")}
            >
              Home
            </button>
          )}
          {location.pathname === "/" ? (
            <button
              className="text-white text-lg block text-left"
              onClick={() => scrollToSection("about")}
            >
              About Us
            </button>
          ) : (
            <Link
              to="/#about"
              className="text-white text-lg block"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
          )}
          {/* Features Dropdown */}
          <div>
            <button
              className="text-white text-lg flex items-center gap-2 w-full text-left"
              onClick={() => scrollToSection("features")}
            >
              Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-5 h-5 transform ${
                  isMobileDropdownOpen ? "rotate-180" : "rotate-0"
                } cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileDropdownOpen(!isMobileDropdownOpen);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Dropdown Items */}
            {isMobileDropdownOpen && (
              <div className="mt-2 ml-2 flex flex-col gap-4">
                <button
                  className="text-white text-sm text-left"
                  onClick={() => scrollToSection("custom-currency")}
                >
                  Custom Currency
                </button>
                <button
                  className="text-white text-sm text-left"
                  onClick={() => scrollToSection("reconciliation-service")}
                >
                  Reconciliation Service
                </button>
                <button
                  className="text-white text-sm text-left"
                  onClick={() => scrollToSection("vendor-kiosk-system")}
                >
                  Vendor Kiosk System
                </button>
                <button
                  className="text-white text-sm text-left"
                  onClick={() => scrollToSection("foot-soldiers")}
                >
                  Foot Soldiers
                </button>
              </div>
            )}
          </div>

          {location.pathname === "/" ? (
            <button
              className="text-white text-lg flex items-center gap-2 text-left"
              onClick={() => scrollToSection("contact")}
            >
              Contact Us
            </button>
          ) : (
            <Link
              to="/#contact"
              className="text-white text-lg block"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          )}

          {/* Mobile Menu Footer for Login and Signup */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              className="block text-xl text-center text-gold mb-8"
              onClick={handlePopUpToggle}
            >
              Sign Up
            </button>
            <Link
              to="/login"
              className="block text-lg text-center text-white mb-12"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;