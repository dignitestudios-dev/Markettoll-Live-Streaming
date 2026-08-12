"use client";

import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useVerifyOtp } from "@/features/auth/hooks/use-verify-otp";
import ButtonLoader from "@/components/ui/button-loader";

export default function VerifyOtpForm() {
  const {
    form,
    onSubmit,
    otp,
    setOtp,
    timer,
    isPending,
    isResending,
    verificationType,
    handleNavigateBack,
    handleOtpPaste,
    handleResendOtp,
  } = useVerifyOtp();

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
        onPaste={handleOtpPaste}
        className="min-h-[90vh] w-full lg:w-1/2 rounded-[30px] bg-[#FFFFFFA6] backdrop-blur-sm p-4 md:p-8 xl:p-12 flex flex-col items-start justify-center gap-4 border border-white/40 shadow-xl relative"
      >
        <button
          type="button"
          onClick={handleNavigateBack}
          className="absolute top-5 left-4 md:left-8 text-gray-700 hover:text-black transition-colors"
          aria-label="Go back"
        >
          <FaArrowLeftLong className="w-[28px] h-[28px]" />
        </button>

        <h2 className="blue-text text-[36px] font-bold mt-8 md:mt-0">
          Verification
        </h2>
        <p className="text-base font-medium lg:w-[90%] text-gray-700">
          Please enter the code that we sent to your{" "}
          {verificationType === "email"
            ? "email"
            : verificationType === "forgot-password"
            ? "email"
            : "phone number"}
          .
        </p>

        <div className="w-full flex items-center justify-between mt-2">
          <input
            type="text"
            id="otp"
            maxLength={4}
            value={otp}
            {...register("otp")}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setOtp(val);
              }
            }}
            
            className="bg-[#fff] outline-none w-full h-[60.5px] p-4 rounded-[20px] text-start blue-text text-[18px] font-bold border border-gray-200 focus:border-[#1E88E5] transition-all"
          />
        </div>
        {errors.otp && (
          <div className="text-xs text-red-500 pl-2 font-medium">
            {errors.otp.message}
          </div>
        )}

        <div className="w-full text-sm flex items-center gap-2 mt-1">
          <p className="text-gray-600">Don’t Receive the Code?</p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={timer > 0 || isResending}
            className={`light-blue-text font-bold hover:underline transition-all ${
              timer > 0 || isResending
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isResending ? "Resending..." : `Resend ${timer > 0 ? `in ${timer}` : ""}`}
          </button>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="blue-bg text-white rounded-[20px] text-base font-bold py-3.5 w-full mt-5 h-[50px] flex items-center justify-center transition-all disabled:opacity-70 shadow-md cursor-pointer"
        >
          {isPending ? <ButtonLoader size={22} className="text-white" /> : "Verify"}
        </button>
      </form>
    </div>
  );
}
