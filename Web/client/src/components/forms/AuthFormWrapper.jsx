import React from "react";
import { Link, useNavigate } from "react-router-dom";

export function AuthFormWrapper({ 
  children, 
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkPath 
}) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col justify-center items-center p-4 min-h-screen">
      <div className="absolute top-4 left-4 md:left-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-black transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="ml-2 text-sm md:text-base">Back</span>
        </button>
      </div>
      
      <div className="space-y-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-4"
          />
          <h1 className="font-playfair text-3xl text-center">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>
        
        {children}
        
        {(footerText || footerLinkText) && (
          <div className="text-center text-sm">
            {footerText}{" "}
            <Link to={footerLinkPath} className="text-gold hover:underline">
              {footerLinkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}