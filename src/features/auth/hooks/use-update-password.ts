"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  updatePasswordSchema,
  UpdatePasswordInput,
} from "@/features/auth/schemas/update-password.schema";
import { useUpdatePasswordMutation } from "@/features/auth/api/auth.mutations";

export function useUpdatePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: updatePassword, isPending } =
    useUpdatePasswordMutation();

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: UpdatePasswordInput) => {
    let email = emailParam;
    if (!email && typeof window !== "undefined") {
      email = sessionStorage.getItem("forgot-password-email") || "";
    }

    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    try {
      const res = await updatePassword({
        password: values.password,
        email,
      });

      form.reset();
      router.push("/auth/password-updated");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    email: emailParam,
    isPending,
    showPassword,
    setShowPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    showConfirmPassword,
    setShowConfirmPassword,
    toggleShowConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
  };
}
