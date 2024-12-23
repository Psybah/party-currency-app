import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SIGNUP_CONTEXT } from "../context";
export function SignupPopup() {
  const { signupOpen, setSignupOpen } = useContext(SIGNUP_CONTEXT);
  const popupRef = useRef(null);
  const onClose = () => setSignupOpen(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (signupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [signupOpen, onClose]);

  if (!signupOpen) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
      <div
        ref={popupRef}
        className="relative bg-bluePrimary bg-opacity-90 backdrop-blur-sm p-10 rounded-3xl w-full max-w-md"
      >
        <button
          onClick={onClose}
          className="top-4 right-4 absolute text-white hover:text-gold"
        >
          <X className="w-6 h-6" />
          <span className="sr-only">Close</span>
        </button>
        <h2 className="mb-10 font-playfair text-2xl text-center text-white">
          Are you joining as a<br />
          CELEBRANT or MERCHANT
        </h2>
        <div className="flex flex-col items-center space-y-4">
          <Link
            to="/merchant-signup"
            className="bg-gold hover:bg-yellow-500 px-20 py-5 rounded-lg w-full text-center text-lg text-white transition-colors"
            onClick={onClose}
          >
            Merchant
          </Link>
          <Link
            to="/celebrant-signup"
            className="border-gold hover:bg-white px-18 py-5 border rounded-lg w-full text-center text-lg text-white hover:text-gold transition-colors"
            onClick={onClose}
          >
            Host/Event planner
          </Link>
        </div>
      </div>
    </div>
  );
}
