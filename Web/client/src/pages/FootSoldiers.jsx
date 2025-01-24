import React from "react";
import half_bg from "../assets/features/half_bg.png";
import FootSoldier from "../assets/features/FootSoldier.svg";
import AppleIcon from "../assets/app-icons/apple-icon.svg";
import AndroidIcon from "../assets/app-icons/android-icon.svg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingContactButton from "../components/FloatingContactButton";

const FootSoldiers = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section
        id="foot-soldiers"
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
            Foot Soldiers
          </h2>
        </div>
      </section>

      {/* Currency Section */}
      <section className="py-12 bg-white text-center">
        <div className="container mx-auto px-6">
          {/* Currency Image */}
          <div className="mb-8">
            <img
              src={FootSoldier}
              alt="Foot Soldiers"
              className="w-full max-w-[500px] mx-auto rounded-md"
            />
          </div>

          {/* Description */}
          <div className="text-paragraph max-w-4xl mx-auto space-y-8 text-left font-montserrat text-lg">
            <p>
                Party Currency’s Foot Soldiers are here to bring your celebration to life, 
                and with the mobile app, managing their services has never been easier. These 
                dedicated representatives roam the event, equipped with party currency, ready 
                to assist guests with spraying as they celebrate.
            </p>
            <p>
                The app allows you to coordinate and track foot soldiers, ensuring they 
                are strategically placed to reach every corner of your event. They serve as 
                both a resource and a guide, helping guests participate in the spraying tradition with ease.
            </p>
            <p>
                With the Party Currency app, you can monitor foot soldier activity and ensure 
                they are assisting guests with any questions about using digital currency. 
                This added layer of support helps ensure your event flows smoothly.
            </p>
            <p>
                Foot soldiers bring the convenience of party currency directly to the crowd, 
                eliminating the need for guests to navigate to a kiosk. This hands-on approach fosters 
                a festive atmosphere, making it easy for everyone to join in the celebration.
            </p>
            <p>
              <span className="font-bold font-playfair text-bluePrimary text-xl">Get started with the Party Currency app </span> 
              today to make your event unforgettable, with foot soldiers on hand to enhance the spraying experience for every guest.
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

      {/* Floating Contact Button */}
      <FloatingContactButton />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FootSoldiers;

