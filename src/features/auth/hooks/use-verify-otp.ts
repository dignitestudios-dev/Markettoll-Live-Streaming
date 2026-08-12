"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  verifyOtpSchema,
  VerifyOtpInput,
} from "@/features/auth/schemas/verify-otp.schema";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/features/auth/api/auth.mutations";

export function useVerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "";
  const verificationType = searchParams.get("type") || "";
  const emailParam = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);

  const { mutateAsync: verifyOtp, isPending: isVerifying } =
    useVerifyOtpMutation();
  const { mutateAsync: resendOtp, isPending: isResending } =
    useResendOtpMutation();

  const form = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleNavigateBack = () => {
    if (from === "forgot-password") {
      router.push("/auth/forgot-password");
    } else if (from === "review-profile") {
      router.push("/review-profile");
    } else {
      router.push("/");
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLFormElement>) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      setOtp(pastedData);
      form.setValue("otp", pastedData, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: VerifyOtpInput) => {
    const otpValue = values.otp || otp;

    try {
      let storedToken = "";
      if (typeof window !== "undefined") {
        const userObj = JSON.parse(localStorage.getItem("user") || "null");
        storedToken = userObj?.token || localStorage.getItem("auth-token") || "";
      }

      const res = await verifyOtp({
        otp: otpValue,
        email: emailParam,
        type: verificationType,
        from,
        token: storedToken,
      });

      if (from === "forgot-password") {
        router.push(
          `/auth/update-password?email=${encodeURIComponent(emailParam)}`
        );
      } else {
        router.push("/review-profile");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Verification failed";
      toast.error(msg);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || isResending) return;

    try {
      let storedToken = "";
      if (typeof window !== "undefined") {
        const userObj = JSON.parse(localStorage.getItem("user") || "null");
        storedToken = userObj?.token || localStorage.getItem("auth-token") || "";
      }

      const res = await resendOtp({
        email: emailParam,
        type: verificationType,
        from,
        token: storedToken,
      });

      setTimer(60);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to resend OTP";
      toast.error(msg);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    otp,
    setOtp: (val: string) => {
      setOtp(val);
      form.setValue("otp", val, { shouldValidate: true });
    },
    timer,
    isPending: isVerifying,
    isResending,
    verificationType,
    handleNavigateBack,
    handleOtpPaste,
    handleResendOtp,
  };
}
