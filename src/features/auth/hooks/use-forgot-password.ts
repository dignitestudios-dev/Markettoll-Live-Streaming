"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from "@/features/auth/schemas/forgot-password.schema";
import { useForgotPasswordMutation } from "@/features/auth/api/auth.mutations";

export function useForgotPassword() {
  const router = useRouter();
  const { mutateAsync: sendOtp, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    try {
      const response = await sendOtp(values.email);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("forgot-password-email", values.email);
      }

      router.push(
        `/auth/verify-otp?from=forgot-password&type=forgot-password&email=${encodeURIComponent(
          values.email
        )}`
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to send OTP";
      toast.error(msg);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
}
