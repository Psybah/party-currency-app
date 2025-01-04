import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faWhatsapp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useLocation } from "react-router-dom"; // Import useLocation

// List of paths where the footer should not be displayed
const WithoutFooter = [
  "/login",
  "/celebrant-signup",
  "/merchant-signup",
  "/forgot-password",
  "/terms",
  "/dashboard",
];

const Footer = () => {
  const { pathname } = useLocation(); // Get the current pathname

  // If the current path is in the WithoutFooter array, return null (don't render the footer)
  if (WithoutFooter.includes(pathname)) return null;

  return (
    <footer className="bg-footer text-white py-10 px-6 md:px-20 ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Company Section */}
        <div>
          <h3 className="font-playfair font-semibold text-2xl mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gold">
                Why Choose Party Currency?
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-gold">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Features Section */}
        <div>
          <h3 className="font-playfair font-semibold text-2xl mb-4">Features</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gold">
                Custom Currency
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Vendor Kiosk System
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Reconciliation Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gold">
                Foot Soldiers
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="font-playfair font-semibold text-2xl mb-4">Contact</h3>
          <ul className="space-y-2">
            <li>partycurrency@gmail.com</li>
            <li>
              <a href="https://wa.me/12404815186" className="hover:text-gold">
                Whatsapp: +1 (240) 481-5186
              </a>
            </li>
            <li>Call: +1 (240) 481-5186</li>
          </ul>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-left mt-10 space-x-6">
        <FontAwesomeIcon
          icon={faTwitter}
          className="text-secbutton text-2xl hover:scale-110"
        />
        <FontAwesomeIcon
          icon={faFacebook}
          className="text-secbutton text-2xl hover:scale-110"
        />
        <FontAwesomeIcon
          icon={faWhatsapp}
          className="text-secbutton text-2xl hover:scale-110"
        />
        <FontAwesomeIcon
          icon={faInstagram}
          className="text-secbutton text-2xl hover:scale-110"
        />
      </div>

      {/* Description Section */}
      <div className="text-left mt-10 text-lg">
        <p className="font-playfair font-semibold text-2xl">
          Party Currency: Effortless Management for Your Event Finances
        </p>
        <p className="mt-2">
          Simplify, streamline, and secure your party transactions with Party
          Currency. Focus on celebrating while we take care of your financial
          management. Protecting your data is our top priority; we implement
          robust security measures and adhere to strict privacy policies to
          ensure your information remains confidential. Experience seamless party
          finance management with Party Currency today!
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