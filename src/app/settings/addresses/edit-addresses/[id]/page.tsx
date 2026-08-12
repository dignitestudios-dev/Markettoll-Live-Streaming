import React from "react";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Edit Address</h2>
      <p className="text-sm text-gray-500">
        Editing address ID: <span className="font-semibold text-gray-700">{id}</span>
      </p>
    </div>
  );
}
