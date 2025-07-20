"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const LEGAL_CONTENT = {
  disclosures: {
    title: "Legal Disclosures",
    body: (
      <div>
        <p className="mb-2">
          <span className="font-semibold">Effective Date:</span> July 16, 2025
        </p>
        <p>
          This page provides key legal disclaimers and compliance statements
          related to OZ Listings&#8482;, operated by{" "}
          <span className="font-semibold">OZ Listings, LLC</span>, a Delaware
          limited liability company.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          Fair Housing Compliance
        </h3>
        <p>
          OZ Listings complies with the{" "}
          <span className="font-semibold">
            Fair Housing Act (Title VIII of the Civil Rights Act of 1968)
          </span>{" "}
          and is committed to equal housing opportunity. We do not discriminate
          based on race, color, religion, sex, disability, familial status, or
          national origin. Any property-related content or marketing is provided
          in alignment with these principles.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          Brokerage and Licensing
        </h3>
        <p>
          OZ Listings, LLC is{" "}
          <span className="font-semibold">
            not a licensed real estate broker
          </span>{" "}
          and does not perform brokerage activities. If a listed project or
          offering involves licensed brokerage services, those services are
          handled by independent third-party providers. Licensing and
          jurisdictional details are available directly from those providers
          upon request.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          Investment Disclaimers
        </h3>
        <p>
          All information on this site is provided for{" "}
          <span className="font-semibold">
            general informational purposes only
          </span>{" "}
          and does not constitute an offer to sell or a solicitation to buy any
          securities. Nothing on this site should be construed as legal, tax,
          financial, or investment advice.
        </p>
        <p>
          You are solely responsible for your own investment decisions and
          should consult with licensed professionals. All real estate
          investments carry risk, including the potential loss of capital. Past
          performance is not indicative of future results.
        </p>
        <p className="font-semibold">
          OZ Listings does not verify or underwrite sponsor offerings and is not
          responsible for third-party websites, representations, or the accuracy
          of external content linked from this platform.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          Opportunity Zone Disclosure
        </h3>
        <p>
          Properties or offerings featured on OZ Listings may be located within
          federally designated{" "}
          <span className="font-semibold">
            Qualified Opportunity Zones (QOZs)
          </span>
          . However, OZ Listings makes{" "}
          <span className="font-semibold">
            no guarantees or representations
          </span>{" "}
          that any particular investment will qualify for Opportunity Zone tax
          treatment.
        </p>
        <p>
          Qualification depends on a variety of factors—including timing,
          structure, investor status, and compliance with IRS regulations. You
          should consult a qualified tax advisor or attorney before relying on
          any Opportunity Zone benefit.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          Terms of Use & Privacy
        </h3>
        <p>
          Use of this platform is governed by our Terms of Use and Privacy
          Policy, which outline your rights, responsibilities, and how your
          information may be shared with third parties.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          Contact for Disclosures
        </h3>
        <p>For additional legal or compliance information, contact:</p>
        <p>
          <span className="font-semibold">OZ Listings, LLC</span>
          <br />
          108 W 13th St, Ste 100 <br />
          Wilmington, DE 19801
          <br />
          <a href="mailto:support@ozlistings.com">support@ozlistings.com</a>
        </p>
      </div>
    ),
  },
  terms: {
    title: "Terms & Conditions",
    body: (
      <div>
        <p className="mb-2">
          <span className="font-semibold">Effective Date:</span> July 16, 2025
        </p>
        <p>
          These Terms and Conditions of Use (the "Agreement") govern your access
          to and use of all websites, services, subdomains, content, forms,
          tools, communications, and technologies made available by{" "}
          <span className="font-semibold">OZ Listings, LLC</span>, a Delaware
          limited liability company with its principal office at{" "}
          <span className="font-semibold">
            108 W 13th St, Ste 100, Wilmington, DE 19801
          </span>{" "}
          ("OZ Listings," "we," "our," or "us"). By accessing or using any part
          of our platform, you ("you" or "User") agree to be legally bound by
          this Agreement, without modification. If you do not agree, you must{" "}
          <span className="font-semibold">immediately discontinue all use</span>{" "}
          of the platform.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          1. Authorized Use and Intended Audience
        </h3>
        <p>
          OZ Listings provides a U.S.-based platform for informational,
          marketing, and connection purposes related to real estate investments,
          Qualified Opportunity Zones, and affiliated sectors such as
          development, lending, and capital markets. Use of this platform is
          strictly limited to individuals and entities located within the{" "}
          <span className="font-semibold">United States</span>. You may only use
          the platform for lawful, personal, or internal business purposes. You
          may not scrape, reverse-engineer, automate, or otherwise misuse the
          system, nor use it for any unauthorized or exploitative commercial
          purpose.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          2. No Investment Advice
        </h3>
        <p>
          All content and tools offered through this platform are for general
          informational purposes only and do{" "}
          <span className="font-semibold">not</span> constitute investment,
          legal, tax, or financial advice. OZ Listings is{" "}
          <span className="font-semibold">not</span> a registered broker-dealer,
          investment adviser, or tax professional. Nothing on this platform
          constitutes an offer, solicitation, or recommendation to buy or sell
          any security or pursue any specific investment strategy. You are
          solely responsible for conducting your own independent due diligence
          and consulting qualified professionals before making any investment
          decisions.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          3. Data Submission and Use
        </h3>
        <p>
          By submitting any information through this platform—including personal
          data, investment preferences, form submissions, or uploaded
          content—you warrant that the data is accurate, lawful, and authorized
          for submission. You grant OZ Listings an{" "}
          <span className="font-semibold">
            irrevocable, perpetual, non-exclusive, royalty-free, transferable,
            and sublicensable license
          </span>{" "}
          to collect, store, use, analyze, share, distribute, monetize, and
          license that data for any lawful purpose, in accordance with our
          Privacy Policy. This may include—but is not limited to—syndication to
          capital providers, developers, or advisors; internal analytics; and
          licensed access to third parties. You waive all rights to control,
          review, or receive compensation for the use or monetization of your
          data, except where required by law.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          4. Third-Party Affiliations and Communications
        </h3>
        <p>
          You acknowledge and agree that OZ Listings may share your data with
          affiliated entities and strategic partners, including:
        </p>
        <ul>
          <li>
            <span className="font-semibold">ACARA Cap LLC</span>
          </li>
          <li>
            <span className="font-semibold">ACARA Management LLC</span>
          </li>
          <li>
            <span className="font-semibold">Kingsbury Media LLC</span>
          </li>
          <li>
            <span className="font-semibold">
              Other present or future affiliates, strategic collaborators, or
              technology partners
            </span>
          </li>
        </ul>
        <p>
          These parties may independently contact you regarding investment
          opportunities, advisory services, or related offerings. Some of your
          data may also be stored on{" "}
          <span className="font-semibold">
            shared infrastructure or platforms
          </span>{" "}
          co-managed by these partners. OZ Listings is not responsible for the
          conduct of third parties but requires its partners to follow
          reasonable standards for data protection and compliance.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          5. Ownership and Intellectual Property
        </h3>
        <p>
          All intellectual property, including content, software, branding,
          layout, logic, and system architecture, is owned by or licensed to OZ
          Listings. Nothing in this Agreement conveys any license or ownership
          rights to Users. You may not copy, modify, transmit, create derivative
          works from, display, or exploit any part of the platform without prior
          written consent from OZ Listings.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          6. Limitations of Liability
        </h3>
        <p>
          To the maximum extent permitted by law, OZ Listings, its members,
          managers, affiliates, officers, employees, and contractors shall{" "}
          <span className="font-semibold">not be liable</span> for any direct,
          indirect, incidental, consequential, special, exemplary, or punitive
          damages arising from your use—or inability to use—this platform or its
          content. Your{" "}
          <span className="font-semibold">sole and exclusive remedy</span> for
          dissatisfaction is to discontinue use of the platform.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">7. Indemnification</h3>
        <p>
          You agree to indemnify, defend, and hold harmless OZ Listings and its
          affiliates, officers, contractors, and agents from any and all claims,
          liabilities, damages, costs, and expenses (including reasonable
          attorneys' fees) arising from:
        </p>
        <ul>
          <li>Your use of the platform</li>
          <li>Your violation of this Agreement</li>
          <li>Your submission of data</li>
          <li>Your interactions with affiliated or third-party services</li>
        </ul>
        <h3 className="mt-4 mb-2 text-lg font-semibold">8. No Warranties</h3>
        <p>
          The platform and all associated services are provided{" "}
          <span className="font-semibold">"AS IS" and "AS AVAILABLE"</span>{" "}
          without warranty of any kind. We disclaim all warranties, express or
          implied, including those of merchantability, fitness for a particular
          purpose, non-infringement, accuracy, or uptime. We do not guarantee
          the availability, quality, reliability, or results of any investment,
          listing, or affiliated offering.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          9. U.S.-Only Jurisdiction and International Users
        </h3>
        <p>
          This platform is intended solely for use within the{" "}
          <span className="font-semibold">United States</span>. We do not target
          users in the <span className="font-semibold">European Union</span>,{" "}
          <span className="font-semibold">United Kingdom</span>, or other
          jurisdictions subject to the General Data Protection Regulation
          (GDPR), and we do not offer services to users in those regions. Any
          data submitted in violation of this restriction may be deleted.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          10. Governing Law and Venue
        </h3>
        <p>
          This Agreement shall be governed by the laws of the{" "}
          <span className="font-semibold">State of California</span>, without
          regard to conflict-of-law principles. Any disputes shall be resolved
          exclusively in the{" "}
          <span className="font-semibold">
            state or federal courts of Contra Costa County, California
          </span>
          .
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          11. Modifications and Termination
        </h3>
        <p>
          We may modify, suspend, or terminate this Agreement or access to any
          part of the platform at any time, without notice or liability.
          Continued use after updates constitutes acceptance of revised terms.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          12. Entire Agreement and Severability
        </h3>
        <p>
          This Agreement, together with our Privacy Policy, constitutes the
          entire agreement between you and OZ Listings regarding use of the
          platform. If any provision is found unenforceable, the remainder will
          remain in full force.
        </p>
        <h3 className="mt-4 mb-2 text-lg font-semibold">
          13. Contact Information
        </h3>
        <p>Questions about these Terms may be directed to:</p>
        <p>
          <span className="font-semibold">OZ Listings, LLC</span>
          <br />
          108 W 13th St, Ste 100
          <br />
          Wilmington, DE 19801
          <br />
          <a href="mailto:support@ozlistings.com">support@ozlistings.com</a>
        </p>
      </div>
    ),
  },
};

export default function LegalModal({ open, onClose, type }) {
  if (!open) return null;
  const { title, body } = LEGAL_CONTENT[type] || {};

  return (
    <AnimatePresence>
      <motion.div
        key="modal-bg"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key="modal-content"
          className="relative h-[80vh] w-full max-w-3xl overflow-scroll border border-black/80 bg-white p-8 text-black shadow-2xl dark:border-white/80 dark:bg-gray-900 dark:text-white"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="mb-2 text-2xl font-bold">{title}</div>
          <div className="prose dark:prose-invert max-w-none">{body}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
