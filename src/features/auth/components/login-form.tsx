"use client";

import React from "react";
import Link from "next/link";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useLogin } from "@/features/auth/hooks/use-login";
import SocialLogin from "./social-login";
import ButtonLoader from "@/components/ui/button-loader";

export default function LoginForm() {
  const {
    form,
    onSubmit,
    isPending,
    errorMessage,
    showPassword,
    toggleShowPassword,
    isTokenLoading,
  } = useLogin();

  const {
    register,
    formState: { errors },
  } = form;

  if (isTokenLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-white min-h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#1E88E5] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-600">Authenticating via SSO token...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div
      className="w-full min-h-screen relative flex items-center justify-end p-4 md:p-10 bg-cover bg-center rounded-[30px]"
      style={{
        backgroundImage: `url('/signup-mockup.png')`,
      }}
    >
      <form
        onSubmit={onSubmit}
        className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] backdrop-blur-sm p-4 md:p-8 xl:p-12 flex flex-col items-start justify-center gap-4 border border-white/40 shadow-xl"
      >
        <h2 className="text-[#1E88E5] text-[36px] font-bold">
          Welcome To Markettoll!
        </h2>
        <p className="text-base font-medium capitalize text-gray-700">
          Where every need finds its perfect match
        </p>

        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="email" className="text-[14px] font-medium text-gray-800">
            Email
          </label>
          <div className="bg-[#FFFFFF80] rounded-[20px] w-full flex items-center justify-start gap-3 p-4 border border-gray-200/50 focus-within:border-[#1E88E5] transition-all">
            <img
              src="/mail-icon.png"
              alt="mail-icon"
              className="w-[17.95px] h-[15.34px] object-contain"
            />
            <input
              id="email"
              type="email"
              placeholder="johnsmith@gmail.com"
              className="w-full bg-transparent text-[14px] font-[400] text-[#5C5C5C] outline-none"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <div className="text-xs text-red-500 pl-2 mt-0.5 font-medium">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-start gap-1">
          <label htmlFor="password" className="text-[14px] font-medium text-gray-800">
            Password
          </label>

          <div className="bg-[#FFFFFF80] rounded-[20px] w-full flex items-center justify-start gap-3 p-4 border border-gray-200/50 focus-within:border-[#1E88E5] transition-all">
            <img
              src="/password-icon.png"
              alt="password-icon"
              className="w-[18px] h-[18px] object-contain"
            />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              className="w-full bg-transparent text-[14px] font-[400] text-[#5C5C5C] outline-none"
              {...register("password")}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="focus:outline-none p-1"
            >
              {!showPassword ? (
                <LuEye className="text-[#606060] text-lg hover:text-black transition-colors" />
              ) : (
                <LuEyeOff className="text-[#606060] text-lg hover:text-black transition-colors" />
              )}
            </button>
          </div>
          {errors.password && (
            <div className="text-xs text-red-500 pl-2 mt-0.5 font-medium">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="text-end w-full">
          <Link
            href="/auth/forgot-password"
            className="text-[14px] font-medium text-gray-700 hover:text-[#1E88E5] transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-[20px] text-base font-bold py-3.5 h-[50px] w-full flex items-center justify-center transition-all disabled:opacity-70 shadow-md cursor-pointer"
        >
          {isPending ? <ButtonLoader size={22} className="text-white" /> : "Log In"}
        </button>

        <div className="w-full text-center mt-3">
          <a
            href="https://form.jotform.com/officeugeai/markettoll-concept-challenge-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1E88E5]  underline hover:opacity-80 transition-opacity"
          >
            Markettoll Vision
          </a>
        </div>

        {/* <p className="text-center text-xs text-[#8B8B8B] mx-auto mt-2.5 font-medium">
          OR
        </p>

        <SocialLogin /> */}

      
      </form>
    </div>

  );
}
