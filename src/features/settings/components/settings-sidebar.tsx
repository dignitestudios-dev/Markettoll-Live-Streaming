"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col items-start border-r border-gray-200 pr-5">
      <h2 className="text-[28px] font-bold blue-text mb-5">Settings</h2>
      
      <Link
        href="/settings"
        className={`text-lg font-semibold px-5 border-t border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname === "/settings" ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Notifications
      </Link>

      {/* <Link
        href="/settings/payment"
        className={`text-lg font-semibold px-5 border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname === "/settings/payment" ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Payment
      </Link> */}

      {/* <Link
        href="/settings/addresses"
        className={`text-lg font-semibold px-5 border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname.startsWith("/settings/addresses") || pathname.startsWith("/settings/edit-home-adress")
            ? "bg-gray-100 text-[#0098EA]"
            : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Address
      </Link> */}

      <Link
        href="/settings/change-password"
        className={`text-lg font-semibold px-5 border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname === "/settings/change-password" ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Change Password
      </Link>

      {/* <Link
        href="/settings/deactivate-listing"
        className={`text-lg font-semibold px-5 border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname === "/settings/deactivate-listing" ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Deactivate Listing
      </Link> */}

      <Link
        href="/settings/terms-and-conditions"
        className={`text-lg font-semibold px-5 border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname === "/settings/terms-and-conditions" ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Terms & Conditions
      </Link>

      <Link
        href="/settings/privacy-policy"
        className={`text-lg font-semibold px-5 border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname === "/settings/privacy-policy" ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Privacy Policy
      </Link>

      {/* <Link
        href="/settings/support-request"
        className={`text-lg font-semibold px-5 border-b border-gray-200 py-3.5 w-full transition-colors ${
          pathname.startsWith("/settings/support-request") ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Support Request
      </Link> */}

      <Link
        href="/settings/delete-account"
        className={`text-lg font-semibold px-5 py-3.5 w-full transition-colors ${
          pathname === "/settings/delete-account" ? "bg-gray-100 text-[#0098EA]" : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        Delete Account
      </Link>
    </div>
  );
}
