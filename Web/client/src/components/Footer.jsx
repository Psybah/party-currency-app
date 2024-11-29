import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faWhatsapp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-footer text-white py-10 px-6 md:px-20 ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Company Section */}
        <div>
          <h3 className="font-playfair font-medium text-xl mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-secbutton">
                Why Choose Party Currency?
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secbutton">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secbutton">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secbutton">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Features Section */}
        <div>
          <h3 className="font-playfair font-medium text-xl mb-4">Features</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-secbutton">
                Custom Currency
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secbutton">
                Vendor Kiosk System
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secbutton">
                Reconciliation Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-secbutton">
                Foot Soldiers
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="font-playfair font-medium text-xl mb-4">Contact</h3>
          <ul className="space-y-2">
            <li>Partycurrency@gmail.com</li>
            <li>Whatsapp: +1 (764) 3782 85</li>
            <li>Call: 1 (437) 1234 74</li>
          </ul>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-left mt-10 space-x-6">
        <FontAwesomeIcon icon={faTwitter} className="text-secbutton text-2xl hover:scale-110" />
        <FontAwesomeIcon icon={faFacebook} className="text-secbutton text-2xl hover:scale-110" />
        <FontAwesomeIcon icon={faWhatsapp} className="text-secbutton text-2xl hover:scale-110" />
        <FontAwesomeIcon icon={faInstagram} className="text-secbutton text-2xl hover:scale-110" />
      </div>

      {/* Description Section */}
      <div className="text-left mt-10 text-lg">
        <p className="font-playfair font-bold text-xl">
          Party Currency: Effortless Management for Your Event Finances
        </p>
        <p className="mt-2">
        Simplify, streamline, and secure your party transactions with Party Currency. 
        Focus on celebrating while we take care of your financial management. Protecting your 
        data is our top priority; we implement robust security measures and 
        adhere to strict privacy policies to ensure your information remains confidential. 
        Experience seamless party finance management with Party Currency today!
        </p>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 border-t border-white pt-5">
        © 2024 Party Currency. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
