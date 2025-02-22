import React from "react";
import aboutImage from "../assets/about-img.jpg";

const About = () => {
  return (
    <section id="about" className="py-40 px-5 md:px-20 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-10
      mr-auto ml-auto lg:max-w-[90%]">
        {/* Text Section */}
        <div className="flex-1">
          <h3 className="text-bluePrimary uppercase font-bold text-lg font-playfair mb-4 text-center md:text-left">
            Smart Spraying Solution
          </h3>
          <h2 className="text-bluePrimary text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-6 text-center md:text-left">
            No Worries, Just Party
          </h2>
          <p className="text-paragraph leading-relaxed text-center md:text-left">
            We understand that organizing events can be overwhelming, so
            receiving and spraying money should be the least of your worries.
            With Party Currency, when your guests shower you with cash, you
            won’t waste a moment fretting about theft or manual counting while
            also adding colour and excitement to your events. We guarantee that
            every "kobo" goes directly into your account before you even leave
            the party.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-1">
          <img
            src={aboutImage}
            alt="About Party Currency"
            className="rounded-3xl w-full object-cover md:max-h-[500px]" 
          />
        </div>
      </div>
    </section>
  );
};

export default About;
