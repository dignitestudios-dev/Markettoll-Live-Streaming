import React, { Suspense } from "react";
import UpdatePasswordForm from "@/features/auth/components/update-password-form";
import ButtonLoader from "@/components/ui/button-loader";

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><ButtonLoader /></div>}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
