"use client";

import React from "react";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useUpdatePassword } from "@/features/auth/hooks/use-update-password";
import ButtonLoader from "@/components/ui/button-loader";

export default function UpdatePasswordForm() {
  const {
    form,
    onSubmit,
    email,
    isPending,
    showPassword,
    toggleShowPassword,
    showConfirmPassword,
    toggleShowConfirmPassword,
  } = useUpdatePassword();

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
        <Link
          href="/auth/forgot-password"
          className="absolute top-5 left-4 md:left-8 text-gray-700 hover:text-black transition-colors"
        >
          <FaArrowLeftLong className="w-[28px] h-[28px]" />
        </Link>

        <h2 className="blue-text text-[36px] font-bold mt-8 md:mt-0">
          Update Password
        </h2>
        <p className="text-base font-medium lg:w-[80%] text-gray-700 mb-2">
          Please enter the code that we sent to your email {email ? `(${email})` : ""}{" "}
          to reset your password.
        </p>

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
              {showPassword ? (
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

        <div className="w-full flex flex-col items-start gap-1">
          <label
            htmlFor="confirmPassword"
            className="text-[14px] font-medium text-gray-800"
          >
            Confirm Password
          </label>

          <div className="bg-[#FFFFFF80] rounded-[20px] w-full flex items-center justify-start gap-3 p-4 border border-gray-200/50 focus-within:border-[#1E88E5] transition-all">
            <img
              src="/password-icon.png"
              alt="password-icon"
              className="w-[18px] h-[18px] object-contain"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Enter Confirm Password"
              className="w-full bg-transparent text-[14px] font-[400] text-[#5C5C5C] outline-none"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="focus:outline-none p-1"
            >
              {showConfirmPassword ? (
                <LuEye className="text-[#606060] text-lg hover:text-black transition-colors" />
              ) : (
                <LuEyeOff className="text-[#606060] text-lg hover:text-black transition-colors" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="text-xs text-red-500 pl-2 mt-0.5 font-medium">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full mt-4 h-[50px] flex items-center justify-center transition-all disabled:opacity-70 shadow-md cursor-pointer"
        >
          {isPending ? <ButtonLoader size={22} className="text-white" /> : "Update"}
        </button>
      </form>
    </div>
  );
}
