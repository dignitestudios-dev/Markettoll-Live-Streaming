"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PasswordUpdatedScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="w-full min-h-screen relative flex items-center justify-end p-4 md:p-10 bg-cover bg-center rounded-[30px]"
      style={{
        backgroundImage: `url('/signup-mockup.png')`,
      }}
    >
      <div className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] backdrop-blur-sm p-4 md:p-8 xl:p-12 flex flex-col items-center justify-center gap-4 border border-white/40 shadow-xl relative text-center">
        <img
          src="/password-update.png"
          alt="password-update"
          className="w-[79.1px] h-[83.59px] object-contain"
        />
        <h2 className="blue-text text-[36px] font-bold">Password Updated!</h2>
        <p className="text-base font-medium lg:w-[80%] text-gray-700">
          Your password has been updated successfully!
        </p>
      </div>
    </div>
  );
}
