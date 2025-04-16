import React from "react";
import { Link } from "react-router-dom";
import customCurrency from "../assets/features/custom_currency.svg";
import reconciliationService from "../assets/features/reconciliation_service.png";
import vendorKioskSystem from "../assets/features/vendor_kiosk_system.jpg";
import footSoldier from "../assets/features/foot_soldier.jpg";

const Features = () => {
  const featuresData = [
    {
      img: customCurrency,
      title: "Custom Currency",
      link: "/custom-currency",
    },
    {
      img: reconciliationService,
      title: "Reconciliation Service",
      link: "/reconciliation-service",
    },
    {
      img: vendorKioskSystem,
      title: "Vendor Kiosk System",
      link: "/vendor-kiosk-system",
    },
    {
      img: footSoldier,
      title: "Foot Soldiers",
      link: "/foot-soldiers",
    },
  ];

  return (
    <section id="features" className="py-12 md:py-20 px-4 md:px-8 lg:px-20 bg-softbg">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-8 md:mb-16 text-center">
          <h3 className="text-bluePrimary text-2xl md:text-3xl lg:text-5xl font-playfair 
                        font-bold mt-4 mb-4 md:mb-6">
            What We Do
          </h3>
          <p className="text-base md:text-lg text-paragraph leading-relaxed max-w-3xl mx-auto">
            Discover our services for effortless spraying and see how we enhance
            <br className="hidden sm:block" /> your party experience with ease and excitement.
          </p>
        </div>

        {/* Card Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 
                      md:gap-6 lg:gap-8 p-4 md:p-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-lightgray rounded-2xl 
                  text-center overflow-hidden 
                  transform transition-transform duration-300 hover:scale-105"
            >
              {/* Image */}
              <div className="p-6">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="items-center w-full h-auto 
                            object-contain rounded-xl mb-4 
                            border-b border-gray-300"
                />
              </div>

              {/* Title */}
              <h3 className="text-paragraph font-playfair text-xl font-bold mb-4 px-2">
                {feature.title}
              </h3>

              {/* Link */}
              <Link
                to={feature.link}
                className="bg-secbutton text-lg text-white 
                                  py-3 px-4 w-[80%] mx-auto mb-6 rounded-lg cursor-pointer inline-block"
              >
                See More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;