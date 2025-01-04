import React, { useContext } from "react"; // Import useContext
import { Link } from "react-router-dom";
import { SIGNUP_CONTEXT } from "../context"; // Import SIGNUP_CONTEXT

export default function TermsOfService() {
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT); // Use useContext to access the context

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            width={60}
            height={60}
            className="mb-6"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-playfair mb-8">Terms of Service</h1>

        {/* Last Updated */}
        <div className="mb-8">
          <h2 className="font-bold mb-2">Last Updated:</h2>
          <p className="text-gray-600">(Launch date Date of Month, Year.) To be updated later</p>
        </div>

        <p className="mb-8">
          Party Currency is owned and operated by HMW1 ("We", "Us", or "Our").
        </p>
        <p className="mb-8">
          These Terms of Service ("ToS") govern your access to and use of the App.
        </p>

        {/* Acceptance */}
        <section className="mb-8">
          <h2 className="font-bold text-xl mb-4">Acceptance:</h2>
          <p>
            By downloading, installing, accessing, or using the App, you agree to be bound by
            these ToS. If you do not agree, please do not use the App.
          </p>
        </section>

        {/* Definitions */}
        <section className="mb-8">
          <h2 className="font-bold text-xl mb-4">Definitions:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>"Celebrant" means you, the individual using the App.</li>
            <li>
              "Vendor" means the authorized merchant operating the POS kiosk station and the
              foot soldiers.
            </li>
            <li>"Party Currency" means the currency designed within the App.</li>
          </ul>
        </section>

        {/* Terms */}
        <section className="mb-8">
          <h2 className="font-bold text-xl mb-4">Terms:</h2>
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <span className="font-semibold">Eligibility:</span> You must be at least 18 years old to use the App.
            </li>
            <li>
              <span className="font-semibold">User Account:</span> You may need to create an account to use the App.
            </li>
            <li>
              <span className="font-semibold">Payment Processing:</span> We use third-party payment processors (e.g., Moniepoint) to
              facilitate transactions.
            </li>
            <li>
              <span className="font-semibold">Party Currency:</span>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>
                  Party Currency has no monetary value and can only be used for the intended
                  purpose only which is to serve as a party note.
                </li>
                <li>Party currency can't be used as a legal tender in Financial Institutions</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Vendor Responsibilities:</span> Vendors are responsible for their own actions and comply
              with applicable laws.
            </li>
            <li>
              <span className="font-semibold">User Conduct:</span> You agree to:
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Use the App lawfully and respectfully.</li>
                <li>Not interfere with App functionality.</li>
                <li>Not infringe intellectual property rights.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Data Protection:</span> We collect and process data in accordance with our Privacy Policy.
            </li>
            <li>
              <span className="font-semibold">Disclaimer:</span> We disclaim warranties of any kind, express or implied.
            </li>
            <li>
              <span className="font-semibold">Limitation of Liability:</span> Our liability is limited to the extent permitted by law.
            </li>
            <li>
              <span className="font-semibold">Indemnification:</span> You agree to indemnify, defend, and hold harmless HMW1, its
              affiliates, officers, directors, employees, agents, and licensors from and against any
              and all claims, damages, losses, liabilities, costs, and expenses (including reasonable
              attorneys' fees) arising from:
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Your use of the App.</li>
                <li>Your breach of these Terms.</li>
                <li>Your violation of any law or third-party rights.</li>
                <li>Any dispute between you and another User or Vendor.</li>
              </ul>
            </li>
            <li>
              <span className="font-semibold">Governing Law:</span> These ToS are governed by Nigerian law.
            </li>
            <li>
              <span className="font-semibold">Changes:</span> We reserve the right to modify these ToS.
            </li>
          </ol>
        </section>

        {/* Additional Policies */}
        <section className="mb-8">
          <h2 className="font-bold text-xl mb-4">Additional Policies:</h2>
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <span className="font-semibold">Privacy Policy:</span>{" "}
              <Link to="/privacy" className="text-gold hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <span className="font-semibold">Contact Us:</span>
              <p className="mt-2">
                For questions or concerns, please contact{" "}
                <Link to="/#contact" className="text-gold hover:underline">
                  us
                </Link>
              </p>
            </li>
            <li>
              <span className="font-semibold">Acknowledgement:</span>
              <p className="mt-2">
                By using the App, you acknowledge that you have read, understood, and agree to
                be bound by these ToS.
              </p>
            </li>
          </ol>
        </section>

        <p className="mb-8 italic">
          Please consult with a lawyer to ensure these ToS comply with your jurisdiction's
          laws and regulations.
        </p>

        <div className="mt-12">
          <Link
            onClick={() => setSignupOpen(true)}
            className="text-gold hover:underline"
          >
            Back to sign up page
          </Link>
        </div>
      </div>
    </div>
  );
}