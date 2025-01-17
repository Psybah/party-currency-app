import React from "react";
import ctaImg from "../assets/cta_img.jpg";
import AppleIcon from "../assets/app-icons/apple-icon.svg";
import AndroidIcon from "../assets/app-icons/android-icon.svg";

const CTASection = () => {
  return (
    <section className="relative flex items-center justify-center py-20 px-5 bg-gray-50">
      {/* Image Container */}
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Background Image */}
        <img
          src={ctaImg}
          alt="Call to Action"
          className="w-full rounded-xl object-cover md:max-h-[500px] lg:max-h-[1000px] xl:max-h-[1500px]" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          {/* Heading */}
          <h2 className="text-sm sm:text-md md:text-3xl lg:text-4xl
           text-white font-playfair mb-2 sm:mb-2 md:mb-8 lg:mb-12
           mt-2 sm:mt-2 md:mt-8 lg:mt-8">
            Join the Celebration!
          </h2>

          {/* Subtitle */}
          <p
            className="font-bold text-sm sm:text-md md:text-2xl lg:text-3xl 
            xl:text-4xl font-playfair bg-clip-text text-transparent 
            bg-gradient-to-r from-gold via-gradientWhite2 to-gradientWhite3 
            mb-1 md:mb-8 lg:mb-10"
          >
            Experience secure transactions with <br /> Party Currency by
            downloading <br />
            our mobile app today.
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-row flex-wrap items-center justify-center 
           gap-1 sm:gap-1 md:gap-6 mt-1 sm:mt-2 md:mt-8">
            {/* Apple Store Button */}
            <button className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 
            md:px-5 md:py-2 bg-gold text-white text-xs sm:text-sm md:text-lg 
            rounded-lg hover:bg-yellow-500 transition">
              <img src={AppleIcon} 
              className="size-6 md:size-10 lg:size-12" 
              alt="Apple icon" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] sm:text-xs md:text-sm 
                lg:text-base font-playfair">
                  Download on the
                </span>
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-playfair">
                  App Store
                </span>
              </div>
            </button>
            {/* Google Play Button */}
            <button className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 
            md:px-5 md:py-2 bg-gold text-white text-xs sm:text-sm md:text-lg 
            rounded-lg hover:bg-yellow-500 transition">
              <img src={AndroidIcon} 
                    alt="google icon"
                    className="size-6 md:size-10 lg:size-12"  />

              <div className="flex flex-col items-start leading-tight">
                <span className="text-[10px] sm:text-xs md:text-sm 
                lg:text-base font-playfair">
                  Download on the
                </span>
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-playfair">
                  Google Play
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
