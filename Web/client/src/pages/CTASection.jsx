import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import ctaImg from "../assets/cta_img.jpg";

const CTASection = () => {
  return (
    <section className="relative flex items-center justify-center py-20 px-5 bg-gray-50">
      {/* Image Container */}
      <div className="relative w-full max-w-6xl">
        {/* Background Image */}
        <img
          src={ctaImg}
          alt="Call to Action"
          className="w-full rounded-lg object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          {/* Heading */}
          <h2 className="text-sm sm:text-xl md:text-4xl lg:text-5xl text-white font-playfair mb-2 sm:mb-2 md:mb-10 lg:mb-20 drop-shadow-lg">
            Join the Celebration!
          </h2>

          {/* Subtitle */}
          <p
            className="font-bold text-sm sm:text-xl 
            md:text-3xl lg:text-4xl xl:text-5xl font-playfair 
            bg-clip-text text-transparent bg-gradient-to-r from-gold 
            via-gradientWhite2 to-gradientWhite3 drop-shadow-lg mb-2 sm:mb-2 md:mb-4 lg:mb-10 "
          >
            Experience secure transactions with <br /> Party Currency by
            downloading <br />
            our mobile app today.
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 mt-2 sm:mt-10 md:mt-10 lg:mt-10">
            {/* Apple Store Button */}
            <button className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-gold text-white text-xs sm:text-lg rounded-xl shadow-md hover:bg-yellow-500 transition">
            <FontAwesomeIcon icon={faApple} className="mr-1 sm:mr-1 md:mr-2 lg:mr-2 text-lg sm:text-lg md:text-3xl lg:text-5xl" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] sm:text-sm md:text-lg lg:text-2xl font-playfair">Download on the</span>
                <span className="text-sm sm:text-sm md:text-xl lg:text-4xl font-playfair">Google Play</span>
              </div>
            </button>
            {/* Google Play Button */}
            <button className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 bg-gold text-white text-xs sm:text-lg rounded-xl shadow-md hover:bg-yellow-500 transition">
              <FontAwesomeIcon icon={faGooglePlay} className="mr-1 sm:mr-1 md:mr-2 lg:mr-2 text-lg sm:text-lg md:text-3xl lg:text-5xl" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] sm:text-sm md:text-lg lg:text-2xl font-playfair">Download on the</span>
                <span className="text-sm sm:text-sm md:text-xl lg:text-4xl font-playfair">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
