import React from "react";
import { MessageCircle } from "lucide-react";

const FloatingContactButton = () => {
  const handleClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-gold hover:bg-yellow-500 
                 text-white rounded-full p-4 shadow-lg 
                 transition-all duration-300 z-50"
      aria-label="Contact Us"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default FloatingContactButton;