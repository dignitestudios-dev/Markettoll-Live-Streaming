import React from "react";
import SettingsLayout from "@/features/settings/components/settings-layout";

export default function SettingsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full padding-x py-6 md:py-10">
      <SettingsLayout>{children}</SettingsLayout>
    </div>
  );
}
