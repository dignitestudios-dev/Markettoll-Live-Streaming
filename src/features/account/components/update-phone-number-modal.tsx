"use client";

import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import ButtonLoader from "@/components/ui/button-loader";
import VerifyOtpModal from "./verify-otp-modal";
import { sendUpdatePhoneNumberOtpApi } from "../api/account.service";
import { useAuth } from "@/hooks/use-auth";
import Cookies from "js-cookie";

interface UpdatePhoneNumberModalProps {
  openPhoneModal: boolean;
  onclick: () => void;
  onSuccessVerified?: () => void;
}

export default function UpdatePhoneNumberModal({
  openPhoneModal,
  onclick,
  onSuccessVerified,
}: UpdatePhoneNumberModalProps) {
  const { user, accessToken } = useAuth();
  const [otpModal, setOtpModal] = useState(false);

  const userProfile = (user || {}) as any;

  const initialPhone =
    typeof userProfile?.phoneNumber === "object"
      ? userProfile?.phoneNumber?.value
      : userProfile?.phoneNumber || "";

  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPhone(initialPhone);
  }, [initialPhone]);

  const handleOtpModal = () => {
    setOtpModal(!otpModal);
  };

  const handleUpdatePhoneNumber = async () => {
    if (!phone.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const token =
      accessToken ||
      Cookies.get("auth-token") ||
      (typeof window !== "undefined" ? localStorage.getItem("auth-token") : "") ||
      "";

    setLoading(true);
    try {
      const res = await sendUpdatePhoneNumberOtpApi(phone, token);
      if (res?.success || res?.status === 200 || res) {
        if (typeof window !== "undefined") {
          localStorage.setItem("phone", phone);
        }
        handleOtpModal();
      }
    } catch (error: any) {
      console.error("update phone number error >>>>", error);
      toast.error(error?.response?.data?.message || "Failed to update phone number");
      onclick();
    } finally {
      setLoading(false);
    }
  };

  if (!openPhoneModal) return null;

  return (
    <>
      <div className="w-full h-screen fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center px-4 z-50">
        <div className="w-full lg:w-[487px] h-[323px] flex flex-col items-center justify-center gap-4 relative bg-white rounded-[12px] shadow-xl p-5">
          <button
            type="button"
            onClick={onclick}
            className="w-6 h-6 rounded-full p-1 bg-[#F7F7F7] absolute top-4 right-4 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
          >
            <IoClose className="w-full h-full text-gray-600" />
          </button>
          <div className="w-[80%] flex flex-col text-center gap-2 items-center justify-center">
            <p className="blue-text text-[20px] font-bold">Update Number</p>
            <p className="leading-[15.6px] text-[#5C5C5C] text-[13px]">
              Enter your new phone number below. We will send a verification
              code to this number for confirmation.
            </p>
          </div>
          <div className="w-[80%] flex flex-col text-center gap-1 items-start justify-center">
            <label htmlFor="phoneNumber" className="text-sm font-medium">
              New Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-white p-3.5 outline-none border rounded-[15px] w-full text-sm focus:border-[#0098EA]"
              placeholder="+1 000 000 0000"
            />
            <button
              className="w-full py-3 rounded-[15px] blue-bg text-white font-semibold mt-4 h-[50px] cursor-pointer flex items-center justify-center hover:bg-blue-600 transition"
              type="button"
              onClick={handleUpdatePhoneNumber}
              disabled={loading}
            >
              {loading ? <ButtonLoader size={20} className="text-white" /> : "Update"}
            </button>
          </div>
        </div>
      </div>

      <VerifyOtpModal
        otpModal={otpModal}
        onclick={handleOtpModal}
        onclick2={onclick}
        phone={phone}
        onSuccessVerified={onSuccessVerified}
      />
    </>
  );
}
