"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function TermsAndConditionsView() {
  useEffect(() => {
    document.title = "MARKET TOLL - Terms & Conditions";
  }, []);

  return (
    <div className="w-full px-2 md:px-6 py-6">
      <h2 className="font-bold blue-text text-[28px]">Terms & Conditions</h2>
      <div className="w-full border-t border-gray-200 mt-3 mb-5" />

      <div className="w-full flex flex-col items-start gap-4 text-gray-700 leading-relaxed">
        <p className="font-semibold text-gray-900">
          Agreement between User and www.Markettoll.com
        </p>
        <p>
          Welcome to www.Markettoll.com. The www.Markettoll.com website (the
          &quot;Site&quot;)/App is composed of various web pages operated by MarketToll.
          www.Markettoll.com is offered to you conditioned on your acceptance
          without modification of the terms, conditions, and notices contained
          herein (the &quot;Terms&quot;). Your use of www.Markettoll.com constitutes your
          agreement to all such Terms. Please read these terms carefully, and
          keep a copy of them for your reference.
        </p>
        <a
          href="https://www.Markettoll.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0098EA] hover:underline font-medium"
        >
          www.Markettoll.com is an E-Commerce Site/app.
        </a>
        <p>
          MarketToll&apos;s main purpose is to provide an online and app platform for
          customers to browse, select and purchase products or services.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Privacy</h3>
        <p>
          Your use of www.Markettoll.com is subject to MarketToll&apos;s Privacy
          Policy. Please review our Privacy Policy, which also governs the Site
          and informs users of our data collection practices.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Electronic Communications</h3>
        <p>
          Visiting{" "}
          <a
            href="https://www.Markettoll.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0098EA] hover:underline font-medium"
          >
            www.Markettoll.com
          </a>{" "}
          or sending emails to MarketToll constitutes electronic communications.
          You consent to receive electronic communications and you agree that
          all agreements, notices, disclosures and other communications that we
          provide to you electronically, via email and on the Site, satisfy any
          legal requirement that such communications be in writing.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Your Account</h3>
        <p>
          If you use this site, you are responsible for maintaining the
          confidentiality of your account and password and for restricting
          access to your computer, and you agree to accept responsibility for
          all activities that occur under your account or password. You may not
          assign or otherwise transfer your account to any other person or
          entity. You acknowledge that MarketToll is not responsible for third
          party access to your account that results from theft or
          misappropriation of your account. MarketToll and its associates
          reserve the right to refuse or cancel service, terminate accounts, or
          remove or edit content in our sole discretion.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Children Under Thirteen</h3>
        <p>
          MarketToll does not knowingly collect, either online or offline,
          personal information from persons under the age of thirteen. If you
          are under 18, you may use www.Markettoll.com only with permission of a
          parent or guardian.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Cancellation/Refund Policy</h3>
        <p>
          You may cancel your subscription at any time. Any cancellations made
          after 60 days of service will not qualify for a refund. Please contact
          us at{" "}
          <a href="mailto:info@marketplace.com" className="text-blue-500 hover:underline">
            info@marketplace.com
          </a>{" "}
          with any questions.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">
          Links to Third Party Sites/Third Party Services
        </h3>
        <p>
          <a
            href="https://www.Markettoll.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0098EA] hover:underline font-medium"
          >
            www.Markettoll.com
          </a>{" "}
          may contain links to other websites (&quot;Linked Sites&quot;). The Linked Sites are
          not under the control of MarketToll and MarketToll is not responsible
          for the contents of any Linked Site, including without limitation any
          link contained in a Linked Site, or any changes or updates to a Linked
          Site. MarketToll is providing these links to you only as a
          convenience, and the inclusion of any link does not imply endorsement
          by MarketToll of the site or any association with its operators.
        </p>
        <p>
          Certain services made available via{" "}
          <a
            href="https://www.Markettoll.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0098EA] hover:underline font-medium"
          >
            www.Markettoll.com
          </a>{" "}
          are delivered by third party sites and organizations. By using any
          product, service or functionality originating from the{" "}
          <a
            href="https://www.Markettoll.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0098EA] hover:underline font-medium"
          >
            www.Markettoll.com
          </a>{" "}
          domain, you hereby acknowledge and consent that MarketToll may share
          such information and data with any third party with whom MarketToll
          has a contractual relationship to provide the requested product,
          service or functionality on behalf of{" "}
          <a
            href="https://www.Markettoll.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0098EA] hover:underline font-medium"
          >
            www.Markettoll.com
          </a>{" "}
          users and customers.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">
          No Unlawful or Prohibited Use/Intellectual Property
        </h3>
        <p>
          You are granted a non-exclusive, non-transferable, revocable license
          to access and use www.Markettoll.com strictly in accordance with these
          terms of use. As a condition of your use of the Site, you warrant to
          MarketToll that you will not use the Site for any purpose that is
          unlawful or prohibited by these Terms. You may not use the Site in any
          manner which could damage, disable, overburden, or impair the Site or
          interfere with any other party&apos;s use and enjoyment of the Site. You
          may not obtain or attempt to obtain any materials or information
          through any means not intentionally made available or provided for
          through the Site.
        </p>
        <p>
          All content included as part of the Service, such as text, graphics,
          logos, images, as well as the compilation thereof, and any software
          used on the Site, is the property of MarketToll or its suppliers and
          protected by copyright and other laws that protect intellectual
          property and proprietary rights. You agree to observe and abide by all
          copyright and other proprietary notices, legends or other restrictions
          contained in any such content and will not make any changes thereto.
        </p>
        <p>
          You will not modify, publish, transmit, reverse engineer, participate
          in the transfer or sale, create derivative works, or in any way
          exploit any of the content, in whole or in part, found on the Site.
          MarketToll content is not for resale. Your use of the Site does not
          entitle you to make any unauthorized use of any protected content, and
          in particular you will not delete or alter any proprietary rights or
          attribution notices in any content. You will use protected content
          solely for your personal use, and will make no other use of the
          content without the express written permission of MarketToll and the
          copyright owner. You agree that you do not acquire any ownership
          rights in any protected content. We do not grant you any licenses,
          express or implied, to the intellectual property of MarketToll or our
          licensors except as expressly authorized by these Terms.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">
          Use of Communication Services
        </h3>
        <p>
          The Site may contain bulletin board services, chat areas, news groups,
          forums, communities, personal web pages, calendars, and/or other
          message or communication facilities designed to enable you to
          communicate with the public at large or with a group (collectively,
          &quot;Communication Services&quot;). You agree to use the Communication Services
          only to post, send and receive messages and material that are proper
          and related to the particular Communication Service.
        </p>
        <p>
          By way of example, and not as a limitation, you agree that when using
          a Communication Service, you will not: defame, abuse, harass, stalk,
          threaten or otherwise violate the legal rights (such as rights of
          privacy and publicity) of others; publish, post, upload, distribute or
          disseminate any inappropriate, profane, defamatory, infringing,
          obscene, indecent or unlawful topic, name, material or information;
          upload files that contain software or other material protected by
          intellectual property laws (or by rights of privacy of publicity)
          unless you own or control the rights thereto or have received all
          necessary consents; upload files that contain viruses, corrupted
          files, or any other similar software or programs that may damage the
          operation of another&apos;s computer; advertise or offer to sell or buy any
          goods or services for any business purpose, unless such Communication
          Service specifically allows such messages; conduct or forward surveys,
          contests, pyramid schemes or chain letters; download any file posted
          by another user of a Communication Service that you know, or
          reasonably should know, cannot be legally distributed in such manner;
          falsify or delete any author attributions, legal or other proper
          notices or proprietary designations or labels of the origin or source
          of software or other material contained in a file that is uploaded;
          restrict or inhibit any other user from using and enjoying the
          Communication Services; violate any code of conduct or other
          guidelines which may be applicable for any particular Communication
          Service; harvest or otherwise collect information about others,
          including e-mail addresses, without their consent; violate any
          applicable laws or regulations.
        </p>

        <p>
          MarketToll has no obligation to monitor the Communication Services.
          However, MarketToll reserves the right to review materials posted to a
          Communication Service and to remove any materials in its sole
          discretion. MarketToll reserves the right to terminate your access to
          any or all of the Communication Services at any time without notice
          for any reason whatsoever.
        </p>

        <p>
          MarketToll reserves the right at all times to disclose any information
          as necessary to satisfy any applicable law, regulation, legal process
          or governmental request, or to edit, refuse to post or to remove any
          information or materials, in whole or in part, in MarketToll&apos;s sole
          discretion.
        </p>

        <p>
          Always use caution when giving out any personally identifying
          information about yourself or your children in any Communication
          Service. MarketToll does not control or endorse the content, messages
          or information found in any Communication Service and, therefore,
          MarketToll specifically disclaims any liability with regard to the
          Communication Services and any actions resulting from your
          participation in any Communication Service. Managers and hosts are not
          authorized MarketToll spokespersons, and their views do not
          necessarily reflect those of MarketToll.
        </p>

        <p>
          Materials uploaded to a Communication Service may be subject to posted
          limitations on usage, reproduction and/or dissemination. You are
          responsible for adhering to such limitations if you upload the
          materials.
        </p>

        <p>
          Materials Provided to www.Markettoll.com or Posted on Any MarketToll
          Web Page: MarketToll does not claim ownership of the materials you
          provide to www.Markettoll.com (including feedback and suggestions) or
          post, upload, input or submit to any MarketToll Site or our associated
          services (collectively &quot;Submissions&quot;). However, by posting, uploading,
          inputting, providing or submitting your Submission you are granting
          MarketToll, our affiliated companies and necessary sublicensees
          permission to use your Submission in connection with the operation of
          their Internet businesses including, without limitation, the rights
          to: copy, distribute, transmit, publicly display, publicly perform,
          reproduce, edit, translate and reformat your Submission; and to
          publish your name in connection with your Submission.
        </p>

        <p>
          No compensation will be paid with respect to the use of your
          Submission, as provided herein. MarketToll is under no obligation to
          post or use any Submission you may provide and may remove any
          Submission at any time in MarketToll&apos;s sole discretion.
        </p>

        <p>
          By posting, uploading, inputting, providing or submitting your
          Submission you warrant and represent that you own or otherwise control
          all of the rights to your Submission as described in this section
          including, without limitation, all the rights necessary for you to
          provide, post, upload, input or submit the Submissions.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Third Party Accounts</h3>
        <p>
          You will be able to connect your MarketToll account to third party
          accounts. By connecting your MarketToll account to your third party
          account, you acknowledge and agree that you are consenting to the
          continuous release of information about you to others (in accordance
          with your privacy settings on those third party sites). If you do not
          want information about you to be shared in this manner, do not use
          this feature.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">International Users</h3>
        <p>
          The Service is controlled, operated and administered by MarketToll
          from our offices within the USA. If you access the Service from a
          location outside the USA, you are responsible for compliance with all
          local laws. You agree that you will not use the MarketToll Content
          accessed through www.Markettoll.com in any country or in any manner
          prohibited by any applicable laws, restrictions or regulations.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Indemnification</h3>
        <p>
          You agree to indemnify, defend and hold harmless MarketToll, its
          officers, directors, employees, agents and third parties, for any
          losses, costs, liabilities and expenses (including reasonable
          attorney&apos;s fees) relating to or arising out of your use of or
          inability to use the Site or services, any user postings made by you,
          your violation of any terms of this Agreement or your violation of any
          rights of a third party, or your violation of any applicable laws,
          rules or regulations. MarketToll reserves the right, at its own cost,
          to assume the exclusive defense and control of any matter otherwise
          subject to indemnification by you, in which event you will fully
          cooperate with MarketToll in asserting any available defenses.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Arbitration</h3>
        <p>
          In the event the parties are not able to resolve any dispute between
          them arising out of or concerning these Terms and Conditions, or any
          provisions hereof, whether in contract, tort, or otherwise at law or
          in equity for damages or any other relief, then such dispute shall be
          resolved only by final and binding arbitration pursuant to the Federal
          Arbitration Act, conducted by a single neutral arbitrator and
          administered by the American Arbitration Association, or a similar
          arbitration service selected by the parties, in a location mutually
          agreed upon by the parties. The arbitrator&apos;s award shall be final, and
          judgment may be entered upon it in any court having jurisdiction. In
          the event that any legal or equitable action, proceeding or
          arbitration arises out of or concerns these Terms and Conditions, the
          prevailing party shall be entitled to recover its costs and reasonable
          attorney&apos;s fees. The parties agree to arbitrate all disputes and
          claims in regards to these Terms and Conditions or any disputes
          arising as a result of these Terms and Conditions, whether directly or
          indirectly, including Tort claims that are a result of these Terms and
          Conditions. The parties agree that the Federal Arbitration Act governs
          the interpretation and enforcement of this provision. The entire
          dispute, including the scope and enforceability of this arbitration
          provision shall be determined by the Arbitrator. This arbitration
          provision shall survive the termination of these Terms and Conditions.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Class Action Waiver</h3>
        <p>
          Any arbitration under these Terms and Conditions will take place on an
          individual basis; class arbitrations and
          class/representative/collective actions are not permitted. THE PARTIES
          AGREE THAT A PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY IN EACH&apos;S
          INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
          PUTATIVE CLASS, COLLECTIVE AND/ OR REPRESENTATIVE PROCEEDING, SUCH AS
          IN THE FORM OF A PRIVATE ATTORNEY GENERAL ACTION AGAINST THE OTHER.
          Further, unless both you and MarketToll agree otherwise, the
          arbitrator may not consolidate more than one person&apos;s claims, and may
          not otherwise preside over any form of a representative or class
          proceeding.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Liability Disclaimer</h3>
        <p className="text-xs md:text-sm uppercase tracking-wide bg-gray-50 p-4 rounded-xl border border-gray-100 font-mono text-gray-600 leading-relaxed">
          THE INFORMATION, SOFTWARE, PRODUCTS, AND SERVICES INCLUDED IN OR
          AVAILABLE THROUGH THE SITE MAY INCLUDE INACCURACIES OR TYPOGRAPHICAL
          ERRORS. CHANGES ARE PERIODICALLY ADDED TO THE INFORMATION HEREIN.
          MARKETTOLL AND/OR ITS SUPPLIERS MAY MAKE IMPROVEMENTS AND/OR CHANGES
          IN THE SITE AT ANY TIME. MARKETTOLL AND/OR ITS SUPPLIERS MAKE NO
          REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY, AVAILABILITY,
          TIMELINESS, AND ACCURACY OF THE INFORMATION, SOFTWARE, PRODUCTS,
          SERVICES AND RELATED GRAPHICS CONTAINED ON THE SITE FOR ANY PURPOSE.
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALL SUCH
          INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND RELATED GRAPHICS ARE
          PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OR CONDITION OF ANY KIND. MARKETTOLL
          AND/OR ITS SUPPLIERS HEREBY DISCLAIM ALL WARRANTIES AND CONDITIONS
          WITH REGARD TO THIS INFORMATION, SOFTWARE, PRODUCTS, SERVICES AND
          RELATED GRAPHICS, INCLUDING ALL IMPLIED WARRANTIES OR CONDITIONS OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND
          NON-INFRINGEMENT. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW,
          IN NO EVENT SHALL MARKETTOLL AND/OR ITS SUPPLIERS BE LIABLE FOR ANY
          DIRECT, INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL DAMAGES
          OR ANY DAMAGES WHATSOEVER INCLUDING, WITHOUT LIMITATION, DAMAGES FOR
          LOSS OF USE, DATA OR PROFITS, ARISING OUT OF OR IN ANY WAY CONNECTED
          WITH THE USE OR PERFORMANCE OF THE SITE, WITH THE DELAY OR INABILITY
          TO USE THE SITE OR RELATED SERVICES, THE PROVISION OF OR FAILURE TO
          PROVIDE SERVICES, OR FOR ANY INFORMATION, SOFTWARE, PRODUCTS, SERVICES
          AND RELATED GRAPHICS OBTAINED THROUGH THE SITE, OR OTHERWISE ARISING
          OUT OF THE USE OF THE SITE, WHETHER BASED ON CONTRACT, TORT,
          NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, EVEN IF MARKETTOLL OR ANY
          OF ITS SUPPLIERS HAS BEEN ADVISED OF THE POSSIBILITY OF DAMAGES.
          BECAUSE SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR
          LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, THE
          ABOVE LIMITATION MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH
          ANY PORTION OF THE SITE, OR WITH ANY OF THESE TERMS OF USE, YOUR SOLE
          AND EXCLUSIVE REMEDY IS TO DISCONTINUE USING THE SITE.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">
          Termination/Access Restriction
        </h3>
        <p>
          MarketToll reserves the right, in its sole discretion, to terminate
          your access to the Site and the related services or any portion
          thereof at any time, without notice. To the maximum extent permitted
          by law, this agreement is governed by the laws of the State of Florida
          and you hereby consent to the exclusive jurisdiction and venue of
          courts in Florida in all disputes arising out of or relating to the
          use of the Site. Use of the Site is unauthorized in any jurisdiction
          that does not give effect to all provisions of these Terms, including,
          without limitation, this section.
        </p>
        <p>
          You agree that no joint venture, partnership, employment, or agency
          relationship exists between you and MarketToll as a result of this
          agreement or use of the Site. MarketToll&apos;s performance of This
          agreement is subject to existing laws and legal process, and nothing
          contained in this agreement is in derogation of MarketToll&apos;s right to
          comply with governmental, court and law enforcement requests or
          requirements relating to your use of the Site or information provided
          to or gathered by MarketToll with respect to such use. If any part of
          this agreement is determined to be invalid or unenforceable pursuant
          to applicable law including, but not limited to, the warranty
          disclaimers and liability limitations set forth above, then the
          invalid or unenforceable provision will be deemed superseded by a
          valid, enforceable provision that most closely matches the intent of
          the original provision and the remainder of the agreement shall
          continue in effect.
        </p>
        <p>
          Unless otherwise specified herein, this agreement constitutes the
          entire agreement between the user and MarketToll with respect to the
          Site/app and it supersedes all prior or contemporaneous communications
          and proposals, whether electronic, oral or written, between the user
          and MarketToll with respect to the Site. A printed version of this
          agreement and of any notice given in electronic form shall be
          admissible in judicial or administrative proceedings based upon or
          relating to this agreement to the same extent and subject to the same
          conditions as other business documents and records originally
          generated and maintained in printed form. It is the express wish to
          the parties that this agreement and all related documents be written
          in English.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Changes to Terms</h3>
        <p>
          MarketToll reserves the right, in its sole discretion, to change the
          Terms under which www.Markettoll.com is offered. The most current
          version of the Terms will supersede all previous versions. MarketToll
          encourages you to periodically review the Terms to stay informed of
          our updates.
        </p>

        <h3 className="font-bold blue-text text-[24px] mt-4">
          MARKETTOLL Arbitration Agreement
        </h3>
        <p>
          By using MARKETTOLL, you agree that any dispute, claim, or controversy
          arising out of or relating to this agreement, your use of the App as a
          buyer or seller, or any transactions conducted through the App will be
          resolved exclusively through binding arbitration. Arbitration will be
          administered by the American Arbitration Association (AAA) under its
          Consumer Arbitration Rules for buyers or its Commercial Arbitration
          Rules for sellers, unless the parties mutually agree to a different
          arbitration provider or rules. Arbitration will be conducted by a
          single neutral arbitrator and may take place virtually or, if agreed
          upon, in person at a location convenient for all parties.
        </p>
        <p>
          You further agree that arbitration will proceed solely on an
          individual basis and not as part of a class, consolidated, or
          representative action. The arbitrator has no authority to consolidate
          claims or preside over class proceedings. This agreement is governed
          by the Federal Arbitration Act (FAA), and any substantive legal issues
          will be resolved in accordance with the laws of the state where
          MARKETTOLLLS LLC, is headquartered, to the extent they do not conflict
          with the FAA.
        </p>
        <p>
          Notwithstanding the above, you may bring an individual claim in small
          claims court if the dispute falls within its jurisdiction, or either
          party may seek injunctive relief in court to address misuse or
          infringement of intellectual property rights. For buyers, MARKETTOLLLS
          LLC will bear the costs of filing and arbitrator fees unless the
          arbitrator determines the claim was frivolous or brought in bad faith.
          For sellers, arbitration costs will be allocated as provided in the
          applicable arbitration rules. Each party is responsible for its own
          attorneys’ fees unless otherwise required by law.
        </p>
        <p>
          You may opt out of this arbitration agreement by providing written
          notice to MARKETTOLLLS LLC at 2101 Vista Pkwy Ste 205 West Palm Beach,
          FL 33411 United States, within 30 days of creating your account or
          first using the App. Your opt-out notice must include your name,
          account information, and a clear statement of your intent to opt out.
          Opting out will not affect any other terms of use.
        </p>
        <p>
          If any part of this arbitration agreement is found to be
          unenforceable, the remaining provisions will remain in effect.
          However, if the class action waiver is found to be unenforceable, this
          entire arbitration agreement will be null and void. By using
          MARKETTOLL, you confirm that you have read, understand, and agree to
          this arbitration agreement.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-2">Contact Us</h3>
        <p>
          MarketToll welcomes your questions or comments regarding the Terms:
        </p>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 w-full max-w-md space-y-1">
          <p className="font-bold text-gray-900">MarketToll</p>
          <p>2101 Vista Parkway</p>
          <p>West Palm Beach, Florida 33411</p>
          <p className="pt-2">
            <span className="font-semibold text-gray-900">Email Address: </span>
            <a
              href="mailto:info@markettoll.com"
              className="underline text-blue-600 hover:text-blue-800"
            >
              info@markettoll.com
            </a>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Telephone number: </span>
            <a href="tel:8883920333" className="text-blue-600 hover:underline">
              8883920333
            </a>
          </p>
        </div>

        <p className="text-sm font-semibold text-gray-500 pt-4">
          Effective as of July 01, 2024
        </p>
      </div>
    </div>
  );
}
