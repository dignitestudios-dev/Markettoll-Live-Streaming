import React from "react";
import Link from "next/link";

export default function SupportRequestPage() {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Support Request</h2>
      <p className="text-sm text-gray-500">
        Choose a support channel to get help from our customer team.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link
          href="/settings/support-request/email-support"
          className="p-5 border border-gray-200 rounded-2xl hover:border-[#0098EA] transition bg-gray-50 flex flex-col gap-2"
        >
          <h3 className="font-bold text-gray-800 text-lg">Email Support</h3>
          <p className="text-xs text-gray-500">
            Submit a ticket or send an email to our support team.
          </p>
        </Link>

        <Link
          href="/settings/support-request/live-chat"
          className="p-5 border border-gray-200 rounded-2xl hover:border-[#0098EA] transition bg-gray-50 flex flex-col gap-2"
        >
          <h3 className="font-bold text-gray-800 text-lg">Live Chat</h3>
          <p className="text-xs text-gray-500">
            Chat live with an online customer support representative.
          </p>
        </Link>
      </div>
    </div>
  );
}
