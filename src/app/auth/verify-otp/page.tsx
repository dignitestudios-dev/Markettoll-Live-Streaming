import React, { Suspense } from "react";
import VerifyOtpForm from "@/features/auth/components/verify-otp-form";
import ButtonLoader from "@/components/ui/button-loader";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><ButtonLoader /></div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
