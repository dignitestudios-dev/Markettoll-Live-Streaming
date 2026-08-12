"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function HomeHeader() {
  const router = useRouter();
  const { user } = useAuth();

  const userName = (user as any)?.name || (user as any)?.firstName || "Mike";

  const handleGoLive = () => {
    if (!user) {
      router.push("/auth/login");
    } else {
      router.push("/create-live-stream");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-[36px] font-bold text-[#003DAC] tracking-tight leading-[45px]">
          Welcome <span className="text-[#003DAC]">{userName}</span>, <span className="text-black">Let’s Shop!</span>
        </h1>
      </div>

      <button
        onClick={handleGoLive}
        className="text-[16px] bg-[#FF0004] hover:bg-red-600 active:scale-95 text-white font-[700] text-base px-6 py-2.5 rounded-[20px] shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
      >
        Go Live Now
      </button>
    </div>
  );
}
