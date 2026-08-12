"use client";

import React from "react";
import SettingsSidebar from "./settings-sidebar";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="bg-[#F7F7F7] w-full lg:h-[90vh] rounded-xl p-3 md:p-5">
      <div className="w-full h-[85vh] p-5 rounded-xl lg:overflow-hidden bg-white grid grid-cols-3 gap-4">
        <div className="col-span-1 hidden lg:block">
          <SettingsSidebar />
        </div>
        <div className="col-span-3 lg:col-span-2 relative lg:overflow-y-scroll settings p-2 lg:p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
