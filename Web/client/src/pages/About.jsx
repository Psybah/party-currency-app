import React from "react";
import aboutImage from "../assets/about-img.jpg";

const About = () => {
  return (
    <section id="about" className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 lg:gap-16">
          {/* Text Section */}
          <div className="flex-1 max-w-2xl">
            <h3 className="text-bluePrimary uppercase font-bold text-sm md:text-base lg:text-lg 
                          font-playfair mb-3 md:mb-4 text-center md:text-left">
              Smart Spraying Solution
            </h3>
            <h2 className="text-bluePrimary text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                          font-playfair font-bold mb-4 md:mb-6 text-center md:text-left">
              No Worries, Just Party
            </h2>
            <p className="text-paragraph text-base md:text-lg leading-relaxed 
                         text-center md:text-left">
              We understand that organizing events can be overwhelming, so
              receiving and spraying money should be the least of your worries.
              With Party Currency, when your guests shower you with cash, you
              won't waste a moment fretting about theft or manual counting while
              also adding colour and excitement to your events. We guarantee that
              every "kobo" goes directly into your account before you even leave
              the party.
            </p>
          </div>

          {/* Image Section */}
          <div className="flex-1 w-full md:w-auto mt-6 md:mt-0">
            <img
              src={aboutImage}
              alt="About Party Currency"
              className="rounded-2xl w-full h-[300px] md:h-[400px] lg:h-[500px] 
                        object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
