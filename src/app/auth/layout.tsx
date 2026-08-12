"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Cookies from "js-cookie";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "");

    const loggedIn = Boolean(user || token);
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setChecking(false);
    }
  }, [user, accessToken, router]);

  if (isLoggedIn || checking) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-white min-h-[calc(100vh-160px)]">
        <div className="w-8 h-8 border-4 border-[#0098EA] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 bg-white min-h-[calc(100vh-160px)]">
      {children}
    </div>
  );
}
