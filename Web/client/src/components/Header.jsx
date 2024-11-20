import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/main_logo.svg";

const Header = () => {
  return (
    <header className="absolute text-white w-full flex justify-between items-center px-20 py-8 z-20">
      {/* Logo */}
      <Link to="/" className="w-32">
        <img src={logo} alt="Party Currency Logo" />
      </Link>

      {/* Navigation Links */}
      <nav className="flex gap-8 items-center font-montserrat text-lg">
        <Link to="/" className="hover:text-gold">Home</Link>
        <Link to="/about" className="hover:text-gold">About Us</Link>
        <Link to="/features" className="hover:text-gold">Features</Link>
        <Link to="/contact" className="hover:text-gold">Contact Us</Link>
      </nav>

      {/* Login and Signup Buttons */}
      <div className="flex gap-6 items-center font-montserrat text-lg">
        <Link to="/login" className="hover:text-gold">Login</Link>
        <Link to="/signup" className="px-4 py-2 bg-gold text-white rounded-xl hover:bg-yellow-500">
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;
