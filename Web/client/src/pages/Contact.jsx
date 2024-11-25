import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";


const Contact = () => {
  return (
    <section id="contact" className="bg-white py-20 px-5 md:px-20">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Left Section: Contact Info */}
        <div className="flex-1 text-left">
          <h4 className="text-bluePrimary font-playfair font-bold text-lg uppercase mb-2">Contact Us</h4>
          <h2 className="text-bluePrimary font-playfair text-3xl md:text-5xl font-bold mb-6">
            Get In Touch With Us
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Got questions or need assistance? Our team is here to ensure your Party Currency experience is smooth and enjoyable—don’t hesitate to reach out!
          </p>
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="flex items-center gap-4">
              <div className="text-blue-700 text-2xl">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <h5 className="text-lg font-bold text-paragraph">Telephone</h5>
                <p className="text-gray-600">1 (437) 1234 74</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-blue-700 text-2xl">
                <i className="fab fa-whatsapp"></i>
              </div>
              <div>
                <h5 className="text-lg font-bold text-paragraph">Whatsapp</h5>
                <p className="text-gray-600">+1 (764) 3782 85</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-blue-700 text-2xl">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <h5 className="text-lg font-bold text-paragraph">Email Address</h5>
                <p className="text-gray-600">partycurrency@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Contact Form */}
        <div className="flex-1 bg-bluePrimary text-white p-8 rounded-2xl">
          <form className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="emailAddress" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                placeholder="Email Address"
                className="w-full p-3 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="telephone" className="block text-sm font-medium mb-1">
                Telephone
              </label>
              <input
                type="text"
                id="telephone"
                placeholder="Telephone"
                className="w-full p-3 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Type in message...
              </label>
              <textarea
                id="message"
                placeholder="Type in message..."
                rows="5"
                className="w-full p-3 rounded-lg text-gray-900"
              />
            </div>

            <button
              type="submit"
              className="bg-gold text-lg font-medium py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all w-full"
            >
              Send Message <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
