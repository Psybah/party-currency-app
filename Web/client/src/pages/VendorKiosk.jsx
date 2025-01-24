import React from "react";
import half_bg from "../assets/features/half_bg.png";
import Kiosk from "../assets/features/kiosk-image.png";
import AppleIcon from "../assets/app-icons/apple-icon.svg";
import AndroidIcon from "../assets/app-icons/android-icon.svg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingContactButton from "../components/FloatingContactButton";

const VendorKiosk = () => {
  return (
    <div>
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section
        id="vendor-kiosk-system"
        className="relative h-[300px] flex flex-col justify-center items-center text-center text-white"
        style={{
          backgroundImage: `url(${half_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-softBlue to-gold opacity-80"></div>

        {/* Content */}
        <div className="relative z-10 px-6">
          {/* Main Heading */}
          <h2
            className="font-bold text-4xl sm:text-5xl 
            md:text-6xl lg:text-7xl font-playfair 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-gold
            via-gradientWhite2 to-gradientWhite3"
          >
            Vendor Kiosk System
          </h2>
        </div>
      </section>

      {/* Currency Section */}
      <section className="py-12 bg-white text-center">
        <div className="container mx-auto px-6">
          {/* Currency Image */}
          <div className="mb-8">
            <img
              src={Kiosk}
              alt="Vendor Kiosk System"
              className="w-full max-w-[500px] mx-auto rounded-md"
            />
          </div>

          {/* Description */}
          <div className="text-paragraph max-w-4xl mx-auto space-y-8 text-left font-montserrat text-lg">
            <p>
                The Vendor Kiosk feature on the Party Currency mobile app offers 
                a centralized platform for cashless transactions, making it easy 
                for vendors to exchange party currency for real cash. Set up as a virtual kiosk, 
                the app allows vendors to access and manage their earnings directly from their phones, 
                ensuring smooth and secure transactions.
            </p>
            <p>
                With its automated system, the app tracks every transaction, 
                making currency exchange simple and reliable. Vendors no longer need to 
                worry about handling physical cash or waiting in line; the app provides a 
                digital, real-time record of all earnings, ensuring complete transparency.
            </p>
            <p>
                By using the Vendor Kiosk, vendors can stay focused on the event, 
                confident that their finances are secure. It is a smart, hassle-free solution 
                for managing on-site earnings without the risks associated with physical cash.
            </p>
            <p>
                The app’s user-friendly design ensures intuitive navigation and immediate 
                access to transaction records. Your vendors will appreciate the simplicity and 
                convenience of the Vendor Kiosk feature, reducing any event-day stress related to finances.
            </p>
            <p>
              <span className="font-bold font-playfair text-bluePrimary text-xl">Download the Party Currency app </span> 
               and offer your vendors a seamless kiosk experience, complete with digital convenience and security.
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex flex-row flex-wrap items-center justify-center 
           gap-1 sm:gap-1 md:gap-6 mt-10 sm:mt-2 md:mt-8">
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
      </section>

      <FloatingContactButton />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VendorKiosk;
