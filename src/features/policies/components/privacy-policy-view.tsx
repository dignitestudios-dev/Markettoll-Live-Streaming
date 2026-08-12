"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function PrivacyPolicyView() {
  useEffect(() => {
    document.title = "MARKET TOLL - Privacy Policy";
  }, []);

  return (
    <div className="w-full flex flex-col py-6 lg:pt-6 gap-4 px-2 md:px-6">
      <h1 className="text-3xl md:text-4xl font-bold blue-text pb-4 border-b border-gray-200 mb-2">
        Privacy Policy
      </h1>

      <p className="text-gray-700 leading-relaxed">
        Markettollls (&quot;Company&quot;) is committed to protecting your privacy and
        ensuring transparency in how we collect, use, and safeguard your
        personal data. This Privacy Policy (&quot;Policy&quot;) applies to the MarketToll
        web and mobile applications (collectively referred to as &quot;Applications&quot;)
        and governs data collection, usage, and user consent practices. By using
        the Applications, you agree to the practices outlined in this Policy.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-2">Data Collection</h3>
      <p className="text-gray-700 leading-relaxed">
        The Company collects only the data necessary to ensure secure access to
        your account and improve user experience.
      </p>
      <h3 className="text-lg font-bold text-gray-900 mt-1">Personal Information Collected</h3>
      <ul className="list-disc px-6 md:px-10 space-y-2 text-gray-700">
        <li>First and last name</li>
        <li>Phone number</li>
        <li>Email address</li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Use of Personal Information</h3>
      <p className="text-gray-700 leading-relaxed">
        The Company uses your personal information exclusively for the purpose
        of <span className="font-semibold text-gray-900">two-factor authentication (2FA)</span> to enhance account
        security.
      </p>
      <ul className="list-decimal px-6 md:px-10 space-y-4 text-gray-700">
        <li>
          <p className="font-bold text-gray-900">Two-Factor Authentication</p>
          <ul className="list-disc px-6 md:px-10 space-y-2 mt-1">
            <li>
              Your phone number and email address are used to verify your
              identity during login and sensitive account activities, ensuring
              the security of your account.
            </li>
          </ul>
        </li>
        <li>
          <p className="font-bold text-gray-900">No Marketing or Promotions</p>
          <ul className="list-disc px-6 md:px-10 space-y-2 mt-1">
            <li>
              The Company does not use your personal information, including your
              phone number, for marketing, promotional communications, or
              unrelated purposes.
            </li>
          </ul>
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Opt-In and Consent for 2FA</h3>
      <p className="text-gray-700 leading-relaxed">
        By providing your phone number and email address, you expressly consent
        to their use for two-factor authentication.
      </p>
      <ul className="list-disc px-6 md:px-10 space-y-2 text-gray-700">
        <li>
          Consent is obtained during account registration or updates to your
          account details.
        </li>
        <li>
          You may revoke consent by deleting your account, but this may prevent
          you from accessing certain features or services.
        </li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Data Sharing</h3>
      <p className="text-gray-700 leading-relaxed">
        The Company does not sell, rent, or lease your personal data to third
        parties. Your personal information may only be shared with trusted
        third-party providers to facilitate two-factor authentication services.
      </p>
      <p className="text-gray-700 leading-relaxed">All third parties are contractually obligated to:</p>
      <ul className="list-disc px-6 md:px-10 space-y-2 text-gray-700">
        <li>Use your information solely for two-factor authentication.</li>
        <li>Safeguard your information and maintain confidentiality.</li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Data Retention</h3>
      <p className="text-gray-700 leading-relaxed">
        The Company retains your personal information only as long as necessary
        to provide two-factor authentication and comply with applicable legal
        obligations.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Opt-Out Mechanism for 2FA</h3>
      <p className="text-gray-700 leading-relaxed">
        Since two-factor authentication is a core security feature, opting out
        of its use may result in restricted access to your account or services.
        You can disable 2FA by contacting us or deleting your account.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Children Under Thirteen</h3>
      <p className="text-gray-700 leading-relaxed">
        The Company does not knowingly collect personal information from
        children under the age of 13. If you are under 13, parental or guardian
        consent is required to use the Applications.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Data Security</h3>
      <p className="text-gray-700 leading-relaxed">
        The Company implements industry-standard measures to protect your
        personal data, including encryption, secure storage, and regular
        security audits.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Changes to This Policy</h3>
      <p className="text-gray-700 leading-relaxed">
        We reserve the right to update this Policy as necessary to reflect
        changes in services or legal requirements. Significant updates will be
        communicated via:
      </p>
      <ul className="list-disc px-6 md:px-10 space-y-2 text-gray-700">
        <li>In-app notifications on the mobile application.</li>
        <li>Updates posted on the website.</li>
        <li>Email communication to registered users.</li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-4">Contact Information</h3>
      <p className="text-gray-700 leading-relaxed">
        For questions or concerns about this Privacy Policy, contact us at:
      </p>
      <h4 className="text-lg font-bold text-gray-900 mt-1">Contact Details</h4>
      <p className="text-gray-700">2101 Vista Parkway</p>
      <p className="text-gray-700">West Palm Beach, Florida 33411</p>
      <p className="text-gray-700">
        Email:{" "}
        <a href="mailto:info@markettoll.com" className="text-blue-500 hover:underline">
          info@markettoll.com
        </a>
      </p>
      <p className="text-gray-700">Phone: 888-392-0333</p>
    </div>
  );
}
