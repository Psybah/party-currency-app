import React from "react";
import half_bg from "../assets/features/half_bg.png";
import reconciliation from "../assets/features/reconciliation.svg";
import AppleIcon from "../assets/app-icons/apple-icon.svg";
import AndroidIcon from "../assets/app-icons/android-icon.svg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingContactButton from "../components/FloatingContactButton";

const ReconciliationService = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section
        id="reconciliation-service"
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
            Reconciliation Service
          </h2>
        </div>
      </section>

      {/* Currency Section */}
      <section className="py-12 bg-white text-center">
        <div className="container mx-auto px-6">
          {/* Currency Image */}
          <div className="mb-8">
            <img
              src={reconciliation}
              alt="Reconciliation Service"
              className="w-full max-w-[500px] mx-auto rounded-md"
            />
          </div>

          {/* Description */}
          <div className="text-paragraph max-w-4xl mx-auto space-y-8 text-left font-montserrat text-lg">
            <p>
                Party Currency's mobile app makes financial reconciliation effortless, 
                ensuring secure, real-time payments to all your event’s vendors. 
                Musicians, caterers, and entertainers simply bring their party currency to the kiosk, 
                where it is automatically converted into real funds—no hassle required.
            </p>
            <p>
                The app tracks and records every transaction, providing complete transparency 
                and accountability. You can now oversee reconciliation for multiple vendors directly 
                through the app, giving event organizers peace of mind.
            </p>
            <p>
                Every transaction is processed securely, with funds seamlessly transferred to 
                vendors’ accounts through Party Currency’s verified systems. This streamlined 
                approach eliminates the need to manage cash at your event, simplifying the entire process
            </p>
            <p>
                The mobile app’s reconciliation feature is user-friendly, 
                accurate, and efficient, allowing you to focus on celebrating while 
                we take care of the finances. It’s a time-saving tool that ensures order and security 
                in every aspect of event spending.
            </p>
            <p>
              <span className="font-bold font-playfair text-bluePrimary text-xl">Get the Party Currency app </span> 
              to enjoy seamless reconciliation services, with secure, direct transfers at your fingertips.
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
      
      {/* Footer */}
      <Footer />
      <FloatingContactButton />
    </div>
  );
};

export default ReconciliationService;

