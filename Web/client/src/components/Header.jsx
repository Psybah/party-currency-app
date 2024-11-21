import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/main_logo.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
  useEffect(() => {
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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 py-2 md:px-5 text-white transition-all duration-300 ${
        isScrolled
          ? "bg-bluePrimary bg-opacity-30 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
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
          <Link to="/" className="hover:text-gold">
            Home
          </Link>
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
          <div className="flex items-center gap-1 hover:text-gold cursor-pointer">
            <Link to="/features">Features</Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          <Link to="/contact" className="hover:text-gold">
            Contact Us
          </Link>
        </nav>

        {/* Login and Signup */}
        <div className="hidden md:flex gap-6 items-center font-montserrat text-lg">
          <Link to="/login" className="hover:text-gold">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-gold text-white rounded-xl hover:bg-yellow-500"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-60 bg-bluePrimary bg-opacity-90 z-40 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="flex justify-end p-4">
          {/* Close Button */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-white cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-6 mt-10 px-6">
          <Link
            to="/"
            className="text-white text-lg block"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          {location.pathname === "/" ? (
            <button
              className="text-white text-lg block text-left"
              onClick={() => {
                scrollToSection("about");
                setIsMenuOpen(false);
              }}
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
          <Link
              to="/features"
              className="text-white text-lg flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </Link>
          <Link
            to="/contact"
            className="text-white text-lg block"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Footer for Login and Signup */}
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/signup"
            className="block text-xl text-center text-gold mb-8"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="block text-lg text-center text-white mb-12"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
