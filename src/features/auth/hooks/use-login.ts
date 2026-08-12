"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import { useLoginMutation } from "@/features/auth/api/auth.mutations";
import { loginSchema, LoginInput } from "@/features/auth/schemas/login.schema";
import { sendFcmToken } from "@/features/auth/api/auth.service";
import { getFcmToken } from "@/firebase/getFcmToken";

export function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { mutateAsync: login, isPending } = useLoginMutation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = Cookies.get("auth-token") || (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "");
    if (token) {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [router]);

  useEffect(() => {
    
    async function getFcm() {
      try {
        const token = await getFcmToken();
        if (token) {
          setFcmToken(token);
        }
      } catch (err) {
        console.log("Error getting FCM token:", err);
      }
    }
    getFcm();
  
  }, []);

  const onSubmit = async (values: LoginInput) => {
    setErrorMessage("");
    try {
      const response = await login(values);

      if (response?.success || response?.data) {
        const userData = response?.data;
        const jwtToken = userData?.token || response?.token || response?.accessToken || "";

        // 1. Set Cookies & LocalStorage immediately
        Cookies.set("user", JSON.stringify(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("auth-user", JSON.stringify(userData));
        if (jwtToken) {
          Cookies.set("auth-token", jwtToken);
          localStorage.setItem("auth-token", jwtToken);
        }

        // 2. Dispatch Redux credentials
        dispatch(setCredentials({ user: userData as any, accessToken: jwtToken }));
        form.reset();

        // 3. Send FCM token in background without blocking navigation
        if (fcmToken && jwtToken) {
          sendFcmToken(fcmToken, jwtToken).catch(() => {});
        }

        // 4. Instant navigation
        const targetPath = userData?.role === "client" ? "/" : "/dashboard";
        router.push(targetPath);
      } else {
        const msg = response?.message || "Login failed";
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Something went wrong";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    errorMessage,
    showPassword,
    setShowPassword,
    toggleShowPassword: () => setShowPassword((prev) => !prev),
    fcmToken,
  };
}
