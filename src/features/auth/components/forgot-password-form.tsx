"use client";

import React from "react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useForgotPassword } from "@/features/auth/hooks/use-forgot-password";
import ButtonLoader from "@/components/ui/button-loader";

export default function ForgotPasswordForm() {
  const { form, onSubmit, isPending } = useForgotPassword();

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div
      className="w-full min-h-screen relative flex items-center justify-end p-4 md:p-10 bg-cover bg-center rounded-[30px]"
      style={{
        backgroundImage: `url('/signup-mockup.png')`,
      }}
    >
      <form
        onSubmit={onSubmit}
        className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] backdrop-blur-sm p-4 md:p-8 xl:p-12 flex flex-col items-start justify-center gap-4 border border-white/40 shadow-xl relative"
      >
        <Link href="/auth/login" className="absolute top-5 left-4 md:left-8 text-gray-700 hover:text-black transition-colors">
          <FaArrowLeftLong className="w-[28px] h-[28px]" />
        </Link>

        <h2 className="blue-text text-[36px] font-bold mt-8 md:mt-0">
          Forgot Password?
        </h2>
        <p className="text-base font-medium lg:w-[80%] text-gray-700">
          Enter your email to reset your password and swiftly resume your
          experience.
        </p>

        <div className="w-full flex flex-col items-start gap-1 mt-3">
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

        <button
          type="submit"
          disabled={isPending}
          className="bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-[20px] text-base font-bold py-3.5 h-[50px] w-full mt-5 flex items-center justify-center transition-all disabled:opacity-70 shadow-md cursor-pointer"
        >
          {isPending ? <ButtonLoader size={22} className="text-white" /> : "Next"}
        </button>
      </form>
    </div>
  );
}
