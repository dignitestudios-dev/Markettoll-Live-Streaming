"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import PhoneNumberSuccessModal from "./phone-number-success-modal";
import { verifyUpdatePhoneNumberOtpApi, resendPhoneNumberOtpApi } from "../api/account.service";
import { useAuth } from "@/hooks/use-auth";
import Cookies from "js-cookie";

interface VerifyOtpModalProps {
  otpModal: boolean;
  onclick?: () => void;
  onclick2?: () => void;
  onClose?: () => void;
  onCloseParentModal?: () => void;
  phone?: string;
  onSuccessVerified?: () => void;
}

export default function VerifyOtpModal({
  otpModal,
  onclick,
  onclick2,
  onClose,
  onCloseParentModal,
  phone = "",
  onSuccessVerified,
}: VerifyOtpModalProps) {
  const handleCloseSelf = onclick || onClose || (() => {});
  const handleCloseParent = onclick2 || onCloseParentModal || (() => {});
  const { accessToken } = useAuth();
  const [showLoader, setShowLoader] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (otpModal) {
      setTimeLeft(60);
      setOtp(["", "", "", ""]);
    }
  }, [otpModal]);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!otpModal) return null;

  const toggleSuccessModal = () => {
    setOpenSuccessModal(!openSuccessModal);
    if (!openSuccessModal) {
      onSuccessVerified?.();
    }
  };

  const handleCloseSuccess = () => {
    setOpenSuccessModal(false);
    handleCloseSelf();
    handleCloseParent();
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length < 4) {
      toast.error("Please enter complete 4-digit OTP");
      return;
    }

    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "") ||
      "";

    setShowLoader(true);
    const targetPhone = phone || (typeof window !== "undefined" ? localStorage.getItem("phone") || "" : "");

    try {
      const res = await verifyUpdatePhoneNumberOtpApi(targetPhone, otpString, token);
      if (res?.success || res?.status === 200 || res) {
        toggleSuccessModal();
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "OTP Verification failed";
      toast.error(msg);
    } finally {
      setShowLoader(false);
    }
  };

  const handleResendOtp = async () => {
    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "") ||
      "";

    const targetPhone = phone || (typeof window !== "undefined" ? localStorage.getItem("phone") || "" : "");

    try {
      setOtp(["", "", "", ""]);
      setTimeLeft(60);
      await resendPhoneNumberOtpApi(targetPhone, token);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <>
      <div className="w-full h-screen fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center px-4">
        <div className="w-full lg:w-[487px] min-h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px] p-5 shadow-2xl">
          <button
            type="button"
            onClick={handleCloseSelf}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
          >
            <IoClose className="w-full h-full text-gray-600" />
          </button>

          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center pt-2">
            <p className="blue-text text-[20px] font-bold">Verification</p>
            <p className="leading-[15.6px] text-[#5C5C5C] text-[13px]">
              Please enter the verification code sent to your new phone number: +1.
            </p>
          </div>

          {showLoader ? (
            <div role="status" className="flex items-center justify-center py-6">
              <svg
                aria-hidden="true"
                className="w-[60px] h-[60px] text-gray-200 animate-spin fill-[#0098EA]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <>
              <div className="w-[80%] flex text-center gap-3 sm:gap-4 items-center justify-center mt-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="bg-[#F7F7F7] w-[45px] sm:w-[50px] text-center h-[45px] sm:h-[50px] outline-none border border-gray-200 focus:border-[#0098EA] rounded-[15px] text-base font-semibold"
                    maxLength={1}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                  />
                ))}
              </div>

              <p className="text-[13px] text-[#5C5C5C] mt-1">
                Didn’t receive OTP code?{" "}
                <button
                  type="button"
                  className="light-blue-text font-bold hover:underline cursor-pointer"
                  onClick={handleResendOtp}
                >
                  Resend now
                </button>
              </p>

              <p className="text-[13px] text-[#5C5C5C]">
                Time remaining: {timeLeft}s
              </p>

              <button
                className="w-full lg:w-[80%] py-3 rounded-[15px] blue-bg text-white font-semibold mt-2 hover:bg-blue-600 transition cursor-pointer"
                type="button"
                onClick={handleVerifyOtp}
              >
                Verify
              </button>
            </>
          )}
        </div>
      </div>

      <PhoneNumberSuccessModal
        state={openSuccessModal}
        onclose={handleCloseSuccess}
      />
    </>
  );
}
