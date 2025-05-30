import React from "react";
import half_bg from "../assets/features/half_bg.png";
import AppleIcon from "../assets/app-icons/apple-icon.svg";
import AndroidIcon from "../assets/app-icons/android-icon.svg";
import { LazyImage } from "../components/LazyImage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingContactButton from "../components/FloatingContactButton";

const CustomCurrency = () => {
  return (
    <div>
      <Header />
      <FloatingContactButton />
      {/* Hero Section */}
      <section
        id="custom-currency"
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
            Custom Currency
          </h2>
        </div>
      </section>

      {/* Currency Section */}
      <section className="py-12 bg-white text-center">
        <div className="container mx-auto px-6">
          {/* Currency Image */}
          <div className="mb-8">
            <img
              src="/lovable-uploads/200-front.jpg"
              alt="Custom Currency"
              className="w-full max-w-[700px] mx-auto rounded-md shadow-md"
            />
          </div>

          {/* Description */}
          <div className="text-paragraph max-w-4xl mx-auto space-y-8 text-left font-montserrat text-lg">
            <p>
              With the Party Currency mobile app, you can design and manage
              unique, custom currency for your events. Imagine personalized
              event currency featuring your chosen designs, themes, or even the
              celebrant's name, adding a special flair to every "spray." This
              feature excites your celebrations, making each spray memorable and
              unique for your guests.
            </p>
            <p>
              Whether it's a wedding, a birthday, or a corporate gathering,
              custom currency allows you to create an identity that perfectly
              aligns with your event's theme. The app simplifies the process of
              selecting design elements and customizing the look of your
              currency—all directly from your phone.
            </p>
            <p>
              This distinct approach engages your guests, creating shared
              memories and amplifying the fun. The app gives you full control to
              make your event currency visually appealing and uniquely yours.
            </p>
            <p>
              Our design team has developed intuitive customization tools,
              allowing you to manage your personalized currency from concept to
              completion. With just a few taps, you can bring an added level of
              joy and exclusivity to your event.
            </p>
            <p>
              <span className="font-bold font-playfair text-bluePrimary text-xl">
                Download the Party Currency app
              </span>{" "}
              today to start creating your custom currency and make every event
              moment a lasting one.
            </p>
          </div>

          {/* Call to Action */}
          <div
            className="flex flex-row flex-wrap items-center justify-center 
           gap-1 sm:gap-1 md:gap-6 mt-10 sm:mt-2 md:mt-8"
          >
            {/* Apple Store Button */}
            <button
              className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 
            md:px-5 md:py-2 bg-gold text-white text-xs sm:text-sm md:text-lg 
            rounded-lg hover:bg-yellow-500 transition"
            >
              <LazyImage
                src={AppleIcon}
                alt="Apple icon"
                className="size-6 md:size-10 lg:size-12"
              />
              <div className="flex flex-col items-start leading-tight">
                <span
                  className="text-[10px] sm:text-xs md:text-sm 
                lg:text-base font-playfair"
                >
                  Download on the
                </span>
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-playfair">
                  App Store
                </span>
              </div>
            </button>
            {/* Google Play Button */}
            <button
              className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 
            md:px-5 md:py-2 bg-gold text-white text-xs sm:text-sm md:text-lg 
            rounded-lg hover:bg-yellow-500 transition"
            >
              <LazyImage
                src={AndroidIcon}
                alt="google icon"
                className="size-6 md:size-10 lg:size-12"
              />
              <div className="flex flex-col items-start leading-tight">
                <span
                  className="text-[10px] sm:text-xs md:text-sm 
                lg:text-base font-playfair"
                >
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
    </div>
  );
};

export default CustomCurrency;
