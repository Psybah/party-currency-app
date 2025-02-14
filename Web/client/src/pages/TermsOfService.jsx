import { useContext } from "react";
import { Link } from "react-router-dom";
import { SIGNUP_CONTEXT } from "@/context";
import { ChevronLeft } from "lucide-react";

export default function TermsOfService() {
  const { setSignupOpen } = useContext(SIGNUP_CONTEXT);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 mt-8">
        {/* Title Section */}
        <div className="mb-12 text-left">
          <img
            src="/logo.svg"
            alt="Party Currency Logo"
            className="h-12 w-auto mb-8"
          />
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last Updated: (Launch date Date of Month, Year.) To be updated later
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none text-left">
          <p>
            Party Currency is owned and operated by HMW1 (&ldquo;We&rdquo;, &ldquo;Us&rdquo;, or &ldquo;Our&rdquo;).
          </p>
          <p>
            These Terms of Service (&ldquo;ToS&rdquo;) govern your access to and use of the App.
          </p>

          {/* Acceptance */}
          <section className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance</h2>
            <p>
              By downloading, installing, accessing, or using the App, you agree to be bound by
              these ToS. If you do not agree, please do not use the App.
            </p>
          </section>

          {/* Definitions */}
          <section className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Definitions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>&ldquo;Celebrant&rdquo; means you, the individual using the App.</li>
              <li>
                &ldquo;Vendor&rdquo; means the authorized merchant operating the POS kiosk station and the
                foot soldiers.
              </li>
              <li>&ldquo;Party Currency&rdquo; means the currency designed within the App.</li>
            </ul>
          </section>

          {/* Terms */}
          <section className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms</h2>
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <strong>Eligibility:</strong> You must be at least 18 years old to use the App.
              </li>
              <li>
                <strong>User Account:</strong> You may need to create an account to use the App.
              </li>
              <li>
                <strong>Payment Processing:</strong> We use third-party payment processors (e.g., Moniepoint) to
                facilitate transactions.
              </li>
              <li>
                <strong>Party Currency:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>
                    Party Currency has no monetary value and can only be used for the intended
                    purpose only which is to serve as a party note.
                  </li>
                  <li>Party currency cannot be used as a legal tender in Financial Institutions</li>
                </ul>
              </li>
              <li>
                <strong>Vendor Responsibilities:</strong> Vendors are responsible for their own actions and comply
                with applicable laws.
              </li>
              <li>
                <strong>User Conduct:</strong> You agree to:
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Use the App lawfully and respectfully.</li>
                  <li>Not interfere with App functionality.</li>
                  <li>Not infringe intellectual property rights.</li>
                </ul>
              </li>
              <li>
                <strong>Data Protection:</strong> We collect and process data in accordance with our Privacy Policy.
              </li>
              <li>
                <strong>Disclaimer:</strong> We disclaim warranties of any kind, express or implied.
              </li>
              <li>
                <strong>Limitation of Liability:</strong> Our liability is limited to the extent permitted by law.
              </li>
              <li>
                <strong>Indemnification:</strong> You agree to indemnify, defend, and hold harmless HMW1, its
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
                <strong>Governing Law:</strong> These ToS are governed by Nigerian law.
              </li>
              <li>
                <strong>Changes:</strong> We reserve the right to modify these ToS.
              </li>
            </ol>
          </section>

          {/* Contact Section */}
          <section className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              For questions or concerns, please{" "}
              <Link to="/#contact" className="text-bluePrimary hover:underline">
                contact us
              </Link>
              .
            </p>
          </section>
        </div>

        {/* Back to Sign Up */}
        <div className="mt-12">
          <button
            onClick={() => setSignupOpen(true)}
            className="text-bluePrimary hover:underline flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to sign up page
          </button>
        </div>
      </div>
    </div>
  );
}