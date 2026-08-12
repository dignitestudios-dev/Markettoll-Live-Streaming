"use client";

import React from "react";
import { IoClose } from "react-icons/io5";

interface PhoneNumberSuccessModalProps {
  state?: boolean;
  onclose?: () => void;
  openSuccessModal?: boolean;
  onClose?: () => void;
}

export default function PhoneNumberSuccessModal({
  onclose,
  state,
  openSuccessModal,
  onClose,
}: PhoneNumberSuccessModalProps) {
  const isVisible = state ?? openSuccessModal ?? false;
  const handleClose = onclose || onClose || (() => {});

  if (!isVisible) return null;

  return (
    <div className="w-full h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-xs z-50 flex items-center justify-center px-4">
      <div className="bg-white p-10 w-full md:w-2/3 lg:w-[487px] h-[210px] relative flex flex-col items-center justify-center gap-2 rounded-xl text-center shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="w-[30px] h-[30px] p-1 rounded-full bg-[#F5F5F5] absolute top-5 right-5 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
        >
          <IoClose className="w-full h-full text-gray-600" />
        </button>

        <img
          src="/check-image.png"
          alt="check-image"
          onError={(e) => {
            // fallback if check-image.png is missing
            (e.target as HTMLElement).style.display = "none";
          }}
          className="w-[69.67px] h-[69.67px] object-contain"
        />

        <p className="text-[#003DAC] text-[20px] font-bold">Number Updated</p>
        <p className="text-sm text-gray-600">Your number has been successfully updated!</p>
      </div>
    </div>
  );
}
