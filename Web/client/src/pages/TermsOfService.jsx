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
            {/* TODO: Replace with actual Last Updated date */}
            Last Updated: April 16, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-left">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OVERVIEW</h2>
            <p>
              The following Terms and Conditions (the &quot;Terms&quot;) is a contract between you and PartyCurrency (&quot;Party Currency&quot;), a private limited liability company incorporated under the laws of the Federal Republic of Nigeria. This website is operated by Party Currency. Throughout the site, the terms &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refer to Party Currency and its successors, affiliates, and assignee&apos;s while &quot;You&quot; and &quot;your&quot; mean the person who uses or accesses the Services.
            </p>
            <p>
              Party Currency offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here. By visiting our site and/or purchasing something from us, you engage in our &quot;Service&quot; and agree to be bound by the following terms and conditions (&quot;Terms of Service&quot;, &quot;Terms&quot;), including those additional terms and conditions and policies referenced herein and/or available by hyperlink.
            </p>
            <p>
              These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content. Please read these Terms of Service carefully before accessing or using our website or any of our services. By accessing or using any part of the site, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all the terms and conditions of this agreement or our Privacy Policy, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
            </p>
             <p>
              Any new features or tools which are added to the current site shall also be subject to the Terms of Service and our Privacy Policy. You can review the most current version of the Terms of Service or Privacy Policy at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service or Privacy Policy by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GENERAL CONDITIONS</h2>
             <ul className="list-disc pl-5 space-y-2">
                <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
                <li>You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</li>
                <li>Credit card information is always encrypted during transfer over networks.</li>
                <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.</li>
                <li>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GOVERNING LANGUAGE</h2>
             <p>The governing language of these Terms and all communication between Party Currency and you will be in the English language.</p>
          </section>

           <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PERSONAL INFORMATION</h2>
             <p>Your submission of personal information through the site is governed by our Privacy Policy. <Link to="/privacy-policy" className="text-bluePrimary hover:underline">View our Privacy Policy</Link>.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ELIGIBILITY</h2>
            <p>
              To use our Services, you must be at least 18 years old, with full legal capacity to accept these Terms and enter into any transaction on the Party Currency website. If as a parent or guardian, you become aware that your child or ward has provided us with any information without your consent, please contact us immediately at partycurrencyteam@gmail.com.
            </p>
             <p>You may use the Services only if you agree to form a binding contract with Party Currency and are not a person barred from receiving services under the laws of the applicable jurisdiction.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">HOW PARTY CURRENCY WORKS</h2>
            <p>
              Party Currency is a service designed to help event organizers securely manage, monitor, and retain monetary gifts commonly referred to as &quot;spraying&quot; received during their events. In traditional contexts, &quot;spraying&quot; refers to the act of guests throwing cash on or around the event host, typically during performances such as dancing, as a form of reward or celebratory gifting.
            </p>
            <p>
              Party Currency digitizes and streamlines this process to ensure transparency and benefit for the event owners. In addition, the service allows event owners to create and customize their own unique event currency, both in name and visual design, to match the theme and identity of their occasion. This personalized digital currency can be used by guests to spray the celebrants in a secure and trackable manner.
            </p>
            <p>
              The traditional approach of spraying real Naira notes has a number of risks and disadvantages. Among which are:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Non celebrants who are not entitled to the money, can simply pick some of the money for themselves, effectively stealing from the event owners.</li>
              <li>Event guests tend to convert their monies into the smallest denomination of the currency to increase the amount of notes they can spray and for how long. This then makes it remarkably tedious to count all the money at the end of the event. This all important task must be done and can take up to 3 hours or more, regardless of how fatigued the event owners must be.</li>
              <li>Event owners must gather a team of trusted friends and family to help ensure no one steals and that all the monies are picked from the ground, transported in bags to a secure location, while one or more of them stand guard over those money bags.</li>
            </ul>
             <p className="mt-4">
              Party Currency addresses key challenges associated with traditional cash spraying at events. When guests wish to participate in spraying, they purchase Party Currency Notes custom-designed, non-monetary tokens provided by the platform instead of using real cash. These notes are stylized to resemble traditional currency in appearance but are clearly marked with prominent disclaimers indicating that they are not legal tender.
          </p>
          <p>
              The full monetary value of the Party Currency Notes purchased by each guest is securely transferred to the event owner&apos;s designated bank account at the conclusion of the event. This ensures the event owner receives the intended financial support without loss or mismanagement. Meanwhile, guests are still able to partake in the cherished cultural tradition of spraying, using the symbolic notes in a festive and meaningful way.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">USING PARTY CURRENCY</h2>
            <p>
              To access and use any Party Currency service, you may be required to register and provide certain personal information, including but not limited to your full name, email address, phone number, and any other details we may reasonably request from time to time (collectively referred to as &quot;User Information&quot;).
            </p>
            <p>
              By registering, you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are the rightful owner of the email address and mobile phone number provided.</li>
              <li>All information submitted during the account creation process and any additional or updated information you provide is true, accurate, current, and complete.</li>
              <li>You will not misrepresent your identity or falsify your User Information at any time.</li>
            </ul>
            <p className="mt-4">
              Upon approval of your registration, you will be granted access to use the Party Currency services, subject to these Terms.
            </p>
            <p>
              For compliance purposes and to enable the provision of our services, you expressly authorize us to verify your identity. This may include the collection, use, and storage of relevant information and documentation, either directly or through a trusted third-party verification service.
            </p>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MODIFICATIONS AND SITE CHANGES</h2>
              <p>We reserve the right to update, change, or replace any part of the content on this site at any time, without obligation to notify users of such updates. You agree that it is your responsibility to monitor our site for changes.</p>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MODIFICATIONS TO SERVICES AND PRICING</h2>
              <p>Prices for our products and services are subject to change at any time without prior notice.</p>
              <p>We also reserve the right to modify or discontinue any part of the Party Currency services temporarily or permanently without notice.</p>
              <p>We shall not be liable to you or to any third party for any modification, price change, suspension, or discontinuance of the service.</p>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ERRORS, INACCURACIES, AND OMISSIONS</h2>
              <p>From time to time, there may be typographical errors, inaccuracies, or omissions in our content, including but not limited to product descriptions, pricing, promotions, offers, service charges, delivery times, and availability.</p>
              <p>We reserve the right to correct such errors, inaccuracies, or omissions, and to update or change information or cancel orders if necessary without prior notice, even after an order has been submitted.</p>
              <p>We do not undertake any obligation to update, amend, or clarify information on the website or within the Service, except as required by law. Any indicated update or refresh date should not be taken to mean that all content has been modified or updated.</p>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">EXCLUSIVITY</h2>
              <p>You agree and acknowledge that Party Currency shall be the exclusive provider of the Services at your event. This includes any product or service that functions as an alternative to cash for the purpose of gifting, spraying, or celebrating event hosts.</p>
              <p>You further agree not to engage or permit the use of any other similar service, system, or product—by yourself or your guests—during your event without prior written consent from Party Currency.</p>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">CUSTOMIZATION OPTION</h2>
              <p>You may request a customization of the Party Currency Notes (the &quot;Notes&quot;) to suit the specific theme or purpose of your event, subject to the following conditions:</p>
              <ol className="list-decimal pl-5 space-y-2">
                  <li>The customization shall not, in any way, infringe upon the exclusive branding, trademark, trade dress, patents, copyrights, or any other proprietary rights of Party Currency in relation to the Notes;</li>
                  <li>The customization design must not contravene any applicable law;</li>
                  <li>The extent and approval of customization shall be at the sole discretion of Party Currency;</li>
                  <li>You are responsible for providing all required specifications, images, text, or other relevant materials necessary for the customization of the Party Currency Notes.</li>
                  <li>The customization shall not preclude Party Currency from maintaining its own branding, trademark, trade dress, or any other identifying marks or features on the Notes;</li>
                  <li>Upon delivery of the customized Notes, you shall not alter, replicate, or further modify the Notes in any way without prior written approval from Party Currency;</li>
                  <li>All customized currency template for an event must be submitted no less than 10 business days before the scheduled event. Any failure to meet this deadline may result in delays in delivery of the customized Notes, for which Party Currency shall not be held responsible.</li>
              </ol>
          </section>

           <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">RESTRICTIONS ON USING THE SERVICES</h2>
              <p>Your use of the Services must at all times comply with applicable laws and regulations. If your access to or use of the Services is prohibited by any law, you are not authorized to use the Services, and Party Currency shall bear no responsibility for any consequences arising from such unauthorized use.</p>
              <p>You agree not to permit any other person or entity to use your username, password, or other credentials to access the Services. You are solely responsible for maintaining the confidentiality, integrity, and security of your account and all User Information associated with it.</p>
              <p>Except as otherwise required by law, you are liable for all transactions and activities carried out through your account, whether or not authorized by you.</p>
              <p>Party Currency shall not be responsible for any losses resulting from the loss, theft, or misuse of your login credentials, nor from any unauthorized or fraudulent transactions linked to your account, except as expressly provided by these Terms or required by law.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">LIMITATION OF LIABILITY</h2>
            <p>
              You expressly acknowledge and agree that your use of the Service, or inability to use the Service, is at your sole risk. The Service, along with all products and services delivered to you through it, is provided &quot;as is&quot; and &quot;as available,&quot; unless expressly stated otherwise by Party Currency.
            </p>
             <p>We make no representations, warranties, or conditions of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, durability, title, or non-infringement.</p>
            <p>
              Under no circumstances shall Party Currency, its directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind. This includes, without limitation, lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether arising in contract, tort (including negligence), strict liability, or otherwise, arising from your use of any of the Services or products obtained through the Service, or for any other claim related in any way to your use of the Service or any product. This includes, but is not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the Service or any content (or product) posted, transmitted, or otherwise made available via the Service, even if we have been advised of the possibility of such damages.
            </p>
            <p>
               Because some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, in such cases, our liability shall be limited to the fullest extent permitted by applicable law.
            </p>
            <p className="mt-4 font-semibold">THE LIMITATION OF LIABILITY WILL EXTEND TO ALL FEATURES ON THE PARTY CURRENCY WEBSITE INCLUDING BUT NOT LIMITED TO:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>PAYMENTS – You acknowledge that all payments processed through the Nigeria Inter-Bank Settlement System (NIBSS) may be subject to delays beyond our control. We shall not be liable for any delayed settlements, disruptions, or interruptions in payment processing arising from issues attributable to NIBSS or any third-party financial systems.</li>
            </ul>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">INTELLECTUAL PROPERTY</h2>
              <p>Unless otherwise expressly stated, Party Currency and/or its licensors retain full ownership of all intellectual property rights in and to the Party Currency website, Party Currency Notes, brand, trademarks, trade dress, documentation, and any other materials or content developed or delivered as part of the Services under this Agreement, in any form or medium.</p>
              <p>This includes all proprietary rights, whether registered or unregistered, and the right to use, reproduce, modify, share, or otherwise deal with such materials as we deem appropriate.</p>
              <p>Nothing in these Terms shall be construed as granting you any license, right, title, or interest in or to any of Party Currency&apos;s intellectual property, whether by implication, estoppel, or otherwise.</p>
              <p>Your access to or use of any part of the Services does not confer upon you any ownership or usage rights beyond what is expressly permitted by Party Currency in writing.</p>
          </section>

           <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">PROHIBITED USES</h2>
              <p>You shall not use your Party Currency Account, the Party Currency website, or Party Currency Notes to engage in the following categories of activities (collectively referred to as &quot;Prohibited Uses&quot;). The list below is representative, not exhaustive. If you are uncertain whether your intended use is permitted, please contact us at partycurrencyteam@gmail.com.</p>
              <ul className="list-disc pl-5 space-y-2">
                  <li>Unlawful activity: Engaging in any conduct that violates or assists in the violation of any law, statute, regulation, or sanction in Nigeria.</li>
                  <li>Fraud: Attempting to defraud Party Currency, other users, or third parties; or providing false, misleading, or inaccurate information to or about Party Currency.</li>
                  <li>Intellectual property infringement: Using or reproducing Party Currency&apos;s intellectual property—including names, logos, trademarks, or copyrighted material—without express written consent, or otherwise violating any third-party rights.</li>
                  <li>Abuse of other users: Interfering with, threatening, harassing, defaming, or otherwise violating the rights, privacy, or access of other users to the Services.</li>
                </ul>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">BREACHES OF THESE TERMS</h2>
              <p>If you breach any provision of these Terms, Party Currency (referred to herein as &quot;Party Currency&quot; where applicable) reserves the right to take any action it deems necessary or appropriate to address the breach. Such actions may include, but are not limited to, suspending or terminating your access to the Services, restricting your use of the Party Currency website or account, and/or initiating legal proceedings against you.</p>
              <p>Party Currency also reserves the right to report any such violations to relevant regulatory or enforcement authorities where applicable.</p>
          </section>

          <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">MISCELLANEOUS</h2>
              <ul className="list-disc pl-5 space-y-2">
                  <li>Amendment - Party Currency reserves the right to add to or terminate any of the Services or amend these Terms at any time, in our sole discretion, without providing notice to you, subject to applicable law. We reserve the right to deliver to you any notice of changes to existing terms or the addition of new terms by posting an updated version of these Terms on the Party Currency website or delivering notice thereof to you electronically. You are free to decide whether or not to accept a revised version of these Terms, but accepting these Terms, as revised, is required for you to continue accessing or using the Services. If you do not agree to these Terms or any revised version of these Terms, your sole recourse is to terminate your access or use of the Services. Except as otherwise expressly stated by us, your access and use of the Services are subject to, and constitute your acceptance of, the version of these Terms in effect at the time of your access or use.</li>
                  <li>Termination - The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes. These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site. If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).</li>
                  <li>Assignment - You may not transfer, assign, or delegate these Terms or your rights or obligations hereunder or your Party Currency Account in any way (by operation of law or otherwise) without our prior written consent. To the extent permitted by applicable law, we may transfer, assign, or delegate these Terms and our rights and obligations hereunder without your consent.</li>
                  <li>Indemnity - At our request, you agree to defend, indemnify, and hold harmless Party Currency, its affiliates and their respective employees, officers, directors, agents, and third-party service providers from and against any and all claims, suits, liabilities, damages (actual and consequential), losses, fines, penalties, costs, and expenses (including reasonable attorneys&apos; fees) arising from or in any way related to any third-party claims relating to your use of the Services, violation of these Terms, applicable law or any third-party rights, or your fraud or wilful misconduct. Such indemnified parties reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, in which event you will cooperate in asserting any available defenses.</li>
                  <li>Severability - In the event that any provision of these Terms is determined to be unlawful, void or unenforceable, such provision shall be deemed to be severed from these Terms but shall not affect the validity and enforceability of the other remaining provisions.</li>
                  <li>Force Majeure - We shall not be liable for any delay or failure to perform as required by these Terms as a result of any cause or condition including but not limited to, an act of God, epidemic, pandemic, act of civil or military authorities, act of terrorists, civil disturbance, war, strike or other labour dispute, fire, interruption in telecommunications or internet services or network provider services, failure of equipment and/or software or any other occurrence which is beyond our reasonable control and shall not affect the validity and enforceability of any remaining provisions.</li>
                  <li>Entire Agreement - The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. These Terms, together with our Privacy Policy constitute the entire and sole agreement between You and Us with respect to the Services and supersede all prior understandings, arrangements, or agreements, whether written or oral, regarding the Services. Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</li>
                  <li>Governing Law - These Terms shall be interpreted and governed in accordance with the Laws of the Federal Republic of Nigeria.</li>
                  <li>Dispute Resolution by Arbitration - For any and all controversies, disputes, demands, claims, or causes of action between you and us (including the interpretation and scope of this section and the arbitrability of the controversy, dispute, demand, claim, or cause of action) relating to the Services or these Terms, you and we agree to resolve any such controversy, dispute, demand, claim, or cause of action exclusively through binding and confidential arbitration. As used in this Section, &quot;we&quot; and &quot;us&quot; mean Party Currency and its affiliates, predecessors, successors, and assigns and all of its and their respective employees, officers, directors, agents, and representatives. In addition, &quot;we&quot; and &quot;us&quot; include any third party providing any product, service, or benefit in connection with the Services or these Terms if such third party is named as a co-party with us in any controversy, dispute, demand, claim, or cause of action subject to this Section. We and you shall use all reasonable endeavors to resolve amicably and in good faith any dispute arising out of or in connection with this Agreement. In the event that we and you are unable to reach a resolution, we and you shall mutually agree on the appointment of a sole arbitrator within fourteen (14) Business Days from when the dispute arises. Where we and you are unable to agree on the appointment of the Arbitrator, such sole arbitrator shall be appointed by the President, Nigerian Institute of Chartered Arbitrators (NICArb) on the application of either party. The venue of the arbitration shall be Lagos State, Nigeria and the language to be used in the arbitral proceedings shall be English. We and you agree that the decision of the Arbitrator shall be final and binding on both of us. Notwithstanding this agreement to arbitrate, either party may seek emergency equitable relief in court in order to maintain the status quo pending arbitration, and each party hereby agrees to submit to the jurisdiction of the court for such purpose. A request for interim measures will not be deemed a waiver of the obligation to arbitrate.</li>
                  <li>Changes to Terms of Service - You can review the most current version of the Terms of Service at any time on this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</li>
                  <li>Change of Control - In the event that Party Currency is acquired by or merged with a third-party entity, we reserve the right, in any of these circumstances, to transfer or assign the information we have collected from you as part of such merger, acquisition, sale, or other change of control.</li>
                </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complaints and Disputes</h2>
            <p>
              If you have any feedback, questions or complaints, contact us via email at{" "}
              <span
                className="text-bluePrimary cursor-pointer hover:underline"
                onClick={() => navigator.clipboard.writeText('partycurrencyteam@gmail.com')}
              >
                partycurrencyteam@gmail.com
              </span>
            </p>
            <p>
              When you contact us, please provide us with the relevant information we need to verify your account.
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