import React from "react";
import { Link } from "react-router-dom";

export const MobileMenu = ({
  isOpen,
  onClose,
  isMobileDropdownOpen,
  setIsMobileDropdownOpen,
  scrollToSection,
  handlePopUpToggle,
  location,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu-panel"
      className="fixed top-0 right-0 w-1/2 h-screen bg-bluePrimary 
        bg-opacity-90 backdrop-blur-sm z-40 transform transition-transform duration-300"
    >
      <div className="flex justify-end p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-8 h-8 text-white cursor-pointer"
          onClick={onClose}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-6 mt-10 px-6">
        {location.pathname === "/" ? (
          <button
            className="block text-left text-lg text-white"
            onClick={() => scrollToSection("hero-section")}
          >
            Home
          </button>
        ) : (
          <button
            className="block text-lg text-white"
            onClick={() => scrollToSection("hero-section")}
          >
            Home
          </button>
        )}
        {location.pathname === "/" ? (
          <button
            className="block text-left text-lg text-white"
            onClick={() => scrollToSection("about")}
          >
            About Us
          </button>
        ) : (
          <Link
            to="/#about"
            className="block text-lg text-white"
            onClick={onClose}
          >
            About Us
          </Link>
        )}
        <div>
          <button
            className="flex items-center gap-2 w-full text-left text-lg text-white"
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

          {isMobileDropdownOpen && (
            <div className="flex flex-col gap-4 mt-2 ml-2">
              <button
                className="text-left text-sm text-white"
                onClick={() => scrollToSection("custom-currency")}
              >
                Custom Currency
              </button>
              <button
                className="text-left text-sm text-white"
                onClick={() => scrollToSection("reconciliation-service")}
              >
                Reconciliation Service
              </button>
              <button
                className="text-left text-sm text-white"
                onClick={() => scrollToSection("vendor-kiosk-system")}
              >
                Vendor Kiosk System
              </button>
              <button
                className="text-left text-sm text-white"
                onClick={() => scrollToSection("foot-soldiers")}
              >
                Foot Soldiers
              </button>
            </div>
          )}
        </div>

        {location.pathname === "/" ? (
          <button
            className="flex items-center gap-2 text-left text-lg text-white"
            onClick={() => scrollToSection("contact")}
          >
            Contact Us
          </button>
        ) : (
          <Link
            to="/#contact"
            className="block text-lg text-white"
            onClick={onClose}
          >
            Contact Us
          </Link>
        )}

        <div className="right-6 bottom-6 left-6 absolute">
          <button
            className="block mb-8 text-gold text-xl"
            onClick={handlePopUpToggle}
          >
            Sign Up
          </button>
          <Link
            to="/login"
            className="block mb-12 text-lg text-white"
            onClick={onClose}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};