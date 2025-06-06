import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faWhatsapp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const WithoutFooter = [
  "/login",
  "/celebrant-signup",
  "/merchant-signup",
  "/forgot-password",
  "/terms",
  "/dashboard",
  "/create-event",
  "/manage-event",
  "/templates",
  "/settings",
];

const Footer = () => {
  const { pathname } = useLocation();

  if (WithoutFooter.includes(pathname)) return null;

  return (
    <footer className="bg-footer text-white py-10 px-6 md:px-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="text-left">
          <h3 className="font-playfair font-semibold text-2xl mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/why-choose-us" 
                className="hover:text-gold"
                onClick={() => window.scrollTo(0, 0)}
              >
                Why Choose Party Currency?
              </Link>
            </li>
            <li>
              <a href="/terms" className="hover:text-gold">
                Terms
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-gold">
                Privacy
              </a>
            </li>
            <li>
              <Link 
                to="/faq" 
                className="hover:text-gold"
                onClick={() => window.scrollTo(0, 0)}
              >
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-left">
          <h3 className="font-playfair font-semibold text-2xl mb-4">Features</h3>
          <ul className="space-y-2">
            <li>
              <a href="/custom-currency" className="hover:text-gold">
                Custom Currency
              </a>
            </li>
            <li>
              <a href="/vendor-kiosk-system" className="hover:text-gold">
                Vendor Kiosk System
              </a>
            </li>
            <li>
              <a href="/reconciliation-service" className="hover:text-gold">
                Reconciliation Service
              </a>
            </li>
            <li>
              <a href="/foot-soldiers" className="hover:text-gold">
                Foot Soldiers
              </a>
            </li>
          </ul>
        </div>

        <div className="text-left">
          <h3 className="font-playfair font-semibold text-2xl mb-4">Contact</h3>
          <ul className="space-y-2">
            <li>partycurrencyteam@gmail.com</li>
            <li>
              <a href="https://wa.me/12404815186" className="hover:text-gold">
                Whatsapp: +1 (240) 481-5186
              </a>
            </li>
            <li>Call: +1 (240) 481-5186</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-start mt-10 space-x-6">
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

      <div className="mt-10 text-left">
        <p className="font-playfair font-semibold text-2xl mb-4">
          Party Currency: Effortless Management for Your Event Finances
        </p>
        <p className="max-w-3xl">
          Simplify, streamline, and secure your party transactions with Party
          Currency. Focus on celebrating while we take care of your financial
          management. Protecting your data is our top priority; we implement
          robust security measures and adhere to strict privacy policies to
          ensure your information remains confidential. Experience seamless party
          finance management with Party Currency today!
        </p>
      </div>

      <div className="text-center mt-10 border-t border-white pt-5">
        © {new Date().getFullYear()} Party Currency. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
