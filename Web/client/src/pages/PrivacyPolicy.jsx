import { useContext } from "react";
import { SIGNUP_CONTEXT } from "@/context";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last Updated: April 16, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-left">
          <section className="mb-8">
            <p>
              PARTY CURRENCY (hereinafter referred to as &quot;Party Currency&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;theCompany&quot;) is committed to protecting the privacy and personal data of all users of our services. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website at www.partycurrency.com (the &quot;Site&quot;) or use any of our services.
            </p>
            <p className="font-bold">
              PLEASE READ THIS PRIVACY POLICY CAREFULLY. BY ACCESSING OR USING OUR SITE OR SERVICES, YOU AGREE TO THE TERMS SET FORTH IN THIS PRIVACY POLICY. IF YOU DO NOT AGREE WITH ANY PART OF THIS PRIVACY POLICY, YOU SHOULD DISCONTINUE USE OF OUR SITE AND SERVICES IMMEDIATELY.
            </p>
             <p>
              We reserve the right to update or modify this Privacy Policy at any time, for any reason, without prior notice, subject to applicable law. You are encouraged to review this Policy periodically to remain informed about how your personal information is protected. Continued use of the Site or services after any changes are made will constitute your acceptance of such changes.
            </p>
            <p>
              Please note that this Privacy Policy does not apply to any third-party websites, services, or applications that may be linked to or accessible from our Site. We are not responsible for the privacy practices or content of any third parties, and we encourage you to review the privacy policies of any such third parties before providing them with your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways. The information we may collect via the site depends on the content and materials you use, and includes:</p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">1.1 Personal Data You Provide Directly</h3>
            <p>We collect personal data that you voluntarily provide to us when you interact with our services. This may include:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Contact Information: We may collect your name, phone number, email address, residential or mailing address, and other contact details as part of our operations.</li>
              <li>Payment Information: When you make a purchase (for example, buying a bundle through our Site), we may collect your payment card details, bank account information, and other relevant billing information.</li>
              <li>Communications: If you contact us for instance, to make an inquiry or submit a support request we may receive additional personal data such as your email address and the content of your communication.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">1.2 Personal Data We Collect Automatically</h3>
            <p>We automatically collect certain information when you interact with our services. This includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Device Information: We collect data about the device and software you use to access our services, such as your Internet Protocol (IP) address, browser type, device type, operating system, and unique device identifiers.</li>
              <li>Usage Information: We gather data on how you interact with our services, including transaction records, session timestamps, pages visited, referring and exit pages, and time spent on our Site. Some of this information may be collected using cookies and similar tracking technologies, as further explained below.</li>
              <li>Location Information: We may collect or infer your approximate location, such as your geographic region, based on your IP address or other technical information.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">1.3 Personal Data That We Receive from Others or Infer</h3>
            <p>In some cases, we may obtain or deduce information about you from other sources:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Partners and Service Providers: We may receive additional personal data from third-party partners, such as financial institutions or payment processors, which we may combine with data already collected to verify your identity or facilitate transactions.</li>
              <li>Public Sources: We may access publicly available data sources, such as government databases, to supplement the information we have about you.</li>
              <li>Inferred Data: Based on the data we collect, we may infer additional personal details. For instance, we may infer your interests or preferences based on your browsing behavior on our Site.</li>
            </ul>
            <p className="mt-4">
              You are not required to provide personal data, and you may choose to restrict certain types of automatic data collection through your browser or device settings. However, please note that doing so may impact your ability to use certain features or services on the Site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Personal Data</h2>
            <p>Having accurate information about you allows us to deliver a smooth, efficient, and personalized experience. Specifically, we use the personal data we collect to:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Provide Services: Deliver the products and services you request from us.</li>
              <li>Respond to Inquiries: Address your questions, feedback, or support requests.</li>
              <li>Enhance and Improve: Analyze data to improve the performance, features, and content of our website and to develop new products and services.</li>
              <li>Monitor Appropriate Use: Identify and address any misuse or unauthorized use of our website or services.</li>
              <li>Prevent Fraud and Manage Risk: Detect, prevent, and manage fraud, security breaches, and other potentially prohibited or illegal activities using internal processes and third-party screening tools.</li>
              <li>Marketing and Communication: Send you promotional materials, newsletters, and service updates curated by Party Currency only where you have explicitly consented to receive such communications.</li>
              <li>Identity Verification: Verify your identity and the accuracy of the information you provide, in accordance with our statutory and regulatory obligations, using both internal tools and third-party services.</li>
              <li>Maintain Records: Keep accurate and current records of our users and their transactions.</li>
              <li>Dispute Resolution and Compliance: Investigate and resolve disputes, including cooperating with law enforcement or regulatory bodies where required.</li>
              <li>Other Legitimate Purposes: Fulfill any other purpose that is disclosed to you in connection with our services and consistent with this Privacy Policy.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclosure of Your Information</h2>
            <p>Party Currency does not sell, trade, or rent your personal data to anyone. We are committed to safeguarding your privacy and will not share or disclose your personal data to third parties without your consent, except as necessary to provide our services or as otherwise described in this Privacy Policy.</p>
            <p>Your personal data may be disclosed under the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Service Providers: We may share your personal data with trusted vendors, agents, or contractors who perform services on our behalf, such as customer support, IT services, security operations, sanctions screening, or identity verification. These service providers are contractually obligated to use the data only for the specific tasks assigned to them and to protect your data in accordance with this Privacy Policy.</li>
              <li>Financial Services & Payment Processing: When you make payments (e.g., to &quot;buy a bundle&quot;), we share relevant information with banks, payment processors, and other financial entities as needed to process payments, detect and prevent fraud, manage credit risk, and comply with financial regulations.</li>
              <li>Affiliates: We may share your information with our subsidiaries, affiliates, and other related entities to deliver services, maintain business operations, and support internal functions across our group companies.</li>
              <li>Corporate Transactions: In the event of a merger, acquisition, financing, bankruptcy, reorganization, sale, or other transfer of some or all of Party Currency&apos;s business or assets, personal data may be part of the transferred assets. You acknowledge that such transfers may occur and that the acquiring entity may continue to use your personal data as set forth in this Privacy Policy. We are not responsible for the actions of third parties with whom you share personal information, and any inquiries regarding third-party communications must be directed to those parties.</li>
              <li>Legal and Regulatory Requirements: We may disclose personal data when required to do so by law or in response to valid legal requests by public authorities, including law enforcement, courts, or government agencies.</li>
              <li>Security, Safety, and Rights Protection: We may disclose your information if we believe it is necessary to: Protect the safety or rights of users, the public, or Party Currency, including to prevent loss of life or serious injury; Detect, prevent, or respond to fraud, misuse of our services, or security issues (such as threats or attacks on our systems); Enforce our agreements, including our Terms of Service, and to protect our legal rights or those of others.</li>
              <li>Third-Party Analytics and Advertising: We may partner with third-party analytics providers and advertisers who collect data through cookies and similar technologies. This data may include device information, geolocation data, and inferred user preferences. For instance, we use Google Analytics to better understand how users engage with our website. To learn how Google uses your data, visit: <a href="https://www.google.com/policies/privacy/partners" target="_blank" rel="noopener noreferrer" className="text-bluePrimary hover:underline">www.google.com/policies/privacy/partners</a>.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Other Third Parties</h2>
            <p>We may share your information with investors for the purpose of conducting general business analysis. We may also share your information with such third parties for marketing purposes, as permitted by law.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Websites and Services</h2>
            <p>Our website may contain links to third-party websites, applications, or services that may be of interest to you, including advertisements or external platforms. These third parties are not affiliated with Party Currency, and once you navigate away from our site, any information you choose to share with such third parties is no longer governed by this Privacy Policy.</p>
            <p>We cannot guarantee the security or privacy of any data you provide to third parties, and we strongly encourage you to review the privacy policies and practices of any third-party website or service before disclosing your personal information. Party Currency is not responsible for the content, policies, or practices of any third-party websites or services linked to or from our site.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p>We implement a range of administrative, technical, and physical safeguards designed to protect your personal information. These measures are intended to reduce the risk of unauthorized access, disclosure, alteration, or destruction of your data.</p>
            <p>However, please note that while we strive to protect your information, no system or method of electronic transmission over the internet is entirely secure or error-free. As such, we cannot guarantee absolute security. Any personal information you choose to share online is done at your own risk and may be vulnerable to interception or misuse by unauthorized parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Options Regarding Your Information</h2>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Account Information</h3>
            <p>You may review, update, or delete the information in your account at any time by:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Logging into your account settings and making the necessary changes; or</li>
              <li>Contacting us using the contact information provided at the end of this Privacy Policy.</li>
            </ul>
            <p className="mt-4">Upon receiving your request to terminate your account, we will deactivate or delete your account and remove your personal data from our active databases. However, certain information may be retained where necessary to prevent fraud, resolve disputes, troubleshoot issues, assist with investigations, enforce our Terms of Service, or comply with legal obligations.</p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Emails and Communications</h3>
            <p>If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Adjusting your communication preferences in your account settings at the time of registration; or</li>
              <li>Clicking the “unsubscribe” link in any of our email communications; or</li>
              <li>Contacting us directly using the contact information provided below.</li>
            </ul>
            <p className="mt-4">If you wish to stop receiving communications from third parties, you must contact those third parties directly, as we are not responsible for their communication practices.</p>
          </section>

           <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:{" "}
              <span
                className="text-bluePrimary cursor-pointer hover:underline"
                onClick={() => navigator.clipboard.writeText('partycurrencyteam@gmail.com')}
              >
                partycurrencyteam@gmail.com
              </span>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
            <p>We use cookies and similar technologies on our website to collect information and support the operation of the site. These tools help us recognize returning users, enhance your user experience, tailor our services and content, deliver targeted advertising, ensure the security of your account, mitigate risk, prevent fraud, and promote trust and safety.</p>
            <p>Cookies are small text files that a website places on your device through your browser. Each cookie contains a unique identifier that allows us to recognize you and present content accordingly when you return to our site.</p>
            <p>Most web browsers accept cookies by default. However, you can typically modify your browser settings to delete or refuse cookies. Please note that disabling cookies may affect the functionality of our website and limit your experience with some of our services.</p>
          </section>

           <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Integrity and Security</h2>
            <p>Party Currency is committed to maintaining the integrity, confidentiality, and security of your personal data. We have implemented comprehensive safeguards physical, technical, and administrative to protect your information from accidental or unauthorized access, disclosure, alteration, or destruction. These protective measures include, but are not limited to:</p>
             <ul className="list-disc pl-5 space-y-2">
                <li>Data encryption during transmission and at rest</li>
                <li>Firewalls and secure server environments</li>
                <li>Access controls and authentication protocols</li>
                <li>Physical security for facilities housing data storage systems</li>
                <li>Internal policies and staff training on data protection best practices</li>
            </ul>
            <p className="mt-4">Access to personal data is strictly limited to employees whose roles require it to fulfill legitimate business purposes. Such employees are bound by confidentiality agreements and are expressly prohibited from using personal data for personal or unauthorized commercial purposes or from disclosing it to unauthorized individuals.</p>
            <p className="mt-4">We review and update our security procedures regularly to ensure continued effectiveness and alignment with industry standards.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Storage Limitation</h2>
            <p>Party Currency will retain your personal data only for as long as is reasonably necessary to fulfill the purposes for which it was collected, including:</p>
             <ul className="list-disc pl-5 space-y-2">
                <li>To provide and support the services we offer</li>
                <li>For the duration your account remains active and you have provided your consent</li>
                <li>To comply with applicable legal and regulatory requirements</li>
                <li>To verify your information with financial institutions, where necessary</li>
            </ul>
            <p className="mt-4">In accordance with statutory obligations, we are required to retain certain personal data to facilitate transaction processing, settlement confirmation, fraud prevention, and compliance with applicable laws and regulatory standards.</p>
             <p className="mt-4">Once the retention period expires, your data will be securely deleted or anonymized, unless we are required by law to retain it for a longer period.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Transfer of Data</h2>
            <p>In the course of providing our services, Party Currency may rely on third-party servers and databases located in jurisdictions outside Nigeria. This may involve the transfer of your personal data to computers or servers in foreign countries.</p>
            <p>We take appropriate steps to ensure that all data collected under this Privacy Policy is processed in accordance with applicable laws and the provisions outlined herein, regardless of where the data is located.</p>
            <p>Where personal data is transferred outside Nigeria, we implement adequate safeguards to ensure the continued protection of such data. All international data transfers are conducted in accordance with the relevant data protection regulations, including but not limited to:</p>
             <ul className="list-disc pl-5 space-y-2">
                <li>The use of legally binding contractual clauses to ensure that your data is handled securely and in line with this Privacy Policy</li>
                <li>Transfers only to countries recognized by the National Information Technology Development Agency (NITDA) as having adequate data protection laws, or to countries listed under the General Data Protection Regulation (GDPR) Adequacy List</li>
            </ul>
            <p className="mt-4">If data must be transferred to a country not deemed to have adequate data protection standards, Party Currency will obtain your informed consent before the transfer and will make you aware of the potential risks associated with such transfers.</p>
            <p className="mt-4">In all cases, we will ensure that your personal data is transmitted securely and treated with the highest level of care. You may request further details about the mechanisms used for international data transfers and the safeguards we have in place by contacting us directly.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Grounds for Processing of Personal Data</h2>
            <p>Party Currency processes personal data only when there is a lawful basis to do so. Processing shall be considered lawful if at least one of the following grounds applies:</p>
             <ul className="list-disc pl-5 space-y-2">
                <li>Consent: You have given clear and informed consent for the processing of your personal data for one or more specific purposes.</li>
                <li>Contractual necessity: The processing is necessary for the performance of a contract to which you are a party, or in order to take steps at your request prior to entering into such a contract.</li>
                <li>Legal obligation: The processing is necessary to comply with a legal obligation to which Party Currency is subject.</li>
                <li>Vital interests: The processing is necessary to protect your vital interests or those of another natural person.</li>
                <li>Public interest or official mandate: The processing is necessary for the performance of a task carried out in the public interest or in the exercise of an official mandate legally vested in Party Currency.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Choices and Rights</h2>
            <p>Individuals whose personal data is held by Party Currency are entitled to exercise the following rights by contacting us:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Right of Access: You have the right to request and access any personal information collected and stored by Party Currency.</li>
                <li>Right to Information: You are entitled to be informed about the collection and use of your personal information.</li>
                <li>Right to Information on International Transfers: You have the right to be informed about the appropriate safeguards in place where your data is transferred to countries outside Nigeria.</li>
                <li>Right to Object to Automated Processing: You may object to automated decision-making or profiling that affects you.</li>
                <li>Right to Rectification: You may request the correction or modification of inaccurate or incomplete personal information held by Party Currency.</li>
                <li>Right to Erasure: You may request the deletion of your personal data, subject to applicable legal and regulatory retention requirements.</li>
                <li>Right to Data Portability: You have the right to request that your personal data be transferred from Party Currency to another service provider, where technically feasible.</li>
                <li>Right to Withdraw Consent: Where processing is based on your consent, you may withdraw that consent at any time.</li>
                <li>Right to Object to Direct Marketing and Processing: You may object to the processing of your data for direct marketing purposes and request restrictions on other forms of data processing.</li>
                <li>Right to Lodge a Complaint: You may submit a complaint to the National Information Technology Development Agency (NITDA) if you believe your data rights have been violated.</li>
            </ul>
             <p className="mt-4">Requests will be handled by Party Currency’s Data Protection Officer and responded to within a 30-day period.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to This Privacy Policy</h2>
            <p>Party Currency reserves the right to update, modify, or amend this Privacy Policy at any time, as our services, technology, or legal obligations evolve. We encourage you to periodically review this page to stay informed of any changes. Continued access to or use of our website and services after changes to this Privacy Policy have been posted will constitute your acceptance of those changes.</p>
          </section>

           <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Policy Violations</h2>
            <p>Any suspected or actual violation of this Privacy Policy should be promptly reported to Party Currency. All reported violations will be appropriately reviewed, and where necessary, subjected to investigation, corrective measures, and applicable sanctions in line with our internal procedures and relevant data protection laws.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, or if you would like to exercise your data protection rights or obtain further information about how we handle your personal information, please contact us at:{" "}
              <span
                className="text-bluePrimary cursor-pointer hover:underline"
                onClick={() => navigator.clipboard.writeText('partycurrencyteam@gmail.com')}
              >
                partycurrencyteam@gmail.com
              </span>
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