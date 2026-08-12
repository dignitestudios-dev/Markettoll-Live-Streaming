import React from "react";
import Link from "next/link";

export default function AddressesPage() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Address Book</h2>
        <Link
          href="/settings/addresses/add-addresses"
          className="bg-[#0098EA] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
        >
          + Add New Address
        </Link>
      </div>
      <p className="text-sm text-gray-500">
        Manage your delivery and billing addresses.
      </p>
    </div>
  );
}
