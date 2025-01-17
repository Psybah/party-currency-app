import React from "react";
import { Link } from "react-router-dom";

export const DesktopNav = ({
  location,
  scrollToSection,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  return (
    <nav className="md:flex items-center gap-8 hidden font-montserrat text-lg">
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
      <div className="relative flex items-center gap-1">
        <button
          className="hover:text-gold"
          onClick={() => scrollToSection("features")}
        >
          Features
        </button>

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
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>

        {isDropdownOpen && (
          <div className="top-full left-0 absolute bg-bluePrimary bg-opacity-50 shadow-md backdrop-blur-xl mt-4 rounded-md w-60 text-white">
            <button
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
              onClick={() => scrollToSection("custom-currency")}
            >
              Custom Currency
            </button>
            <button
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
              onClick={() => scrollToSection("reconciliation-service")}
            >
              Reconciliation Service
            </button>
            <button
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
              onClick={() => scrollToSection("vendor-kiosk-system")}
            >
              Vendor Kiosk System
            </button>
            <button
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
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
  );
};