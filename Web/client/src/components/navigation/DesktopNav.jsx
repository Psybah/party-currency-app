import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const DesktopNav = ({
  location,
  scrollToSection,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      scrollToSection("hero-section");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="md:flex items-center gap-8 hidden font-montserrat text-lg">
      <button
        className="hover:text-gold"
        onClick={handleHomeClick}
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
            <Link
              to="/custom-currency"
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
            >
              Custom Currency
            </Link>
            <Link
              to="/reconciliation-service"
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
            >
              Reconciliation Service
            </Link>
            <Link
              to="/vendor-kiosk-system"
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
            >
              Vendor Kiosk System
            </Link>
            <Link
              to="/foot-soldiers"
              className="block hover:bg-gray-100 px-4 py-4 w-full text-left hover:text-gold"
            >
              Foot Soldiers
            </Link>
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