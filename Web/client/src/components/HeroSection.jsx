import React from "react";
import heroBg from "../assets/bg_image.png";

const HeroSection = () => {
  return (
    <section
      id="hero-section"
      className="relative h-screen flex flex-col justify-center items-center text-center text-white"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-softBlue to-gold opacity-80"></div>

      {/* Content */}
      <div className="relative z-10 px-6">
        {/* Title */}
        <h1 className="text-sm sm:text-sm md:text-2xl font-montserrat tracking-wide mb-4">
          MAKE IT RAIN WITH PARTY CURRENCY!
        </h1>

        {/* Main Heading */}
        <h2 className="font-bold text-4xl sm:text-5xl 
        md:text-6xl lg:text-7xl font-playfair 
        bg-clip-text text-transparent 
        bg-gradient-to-r from-gold
        via-gradientWhite2 to-gradientWhite3">
          What’s the Generous Sum <br className="hidden sm:block" /> Coming Your Way?
        </h2>

        {/* Button */}
        <button className="mt-8 sm:mt-10 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg bg-gold text-white rounded-lg sm:rounded-xl shadow-md hover:bg-yellow-500 transition-all">
          Get Party Currency
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
