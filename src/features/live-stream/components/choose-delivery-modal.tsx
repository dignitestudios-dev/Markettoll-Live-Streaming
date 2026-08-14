"use client";

import React from "react";
import { GiCardPickup } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface ChooseDeliveryModalProps {
  showPopup: boolean;
  handleShowPopup: () => void;
  handleSelectFulfillmentMethod: (method: { selfPickup: boolean; delivery: boolean }) => void;
}

export default function ChooseDeliveryModal({
  showPopup,
  handleShowPopup,
  handleSelectFulfillmentMethod,
}: ChooseDeliveryModalProps) {
  const handlePickupClick = () => {
    handleSelectFulfillmentMethod({ selfPickup: true, delivery: false });
  };

  const handleDeliveryClick = () => {
    handleSelectFulfillmentMethod({ selfPickup: false, delivery: true });
  };

  if (!showPopup) return null;

  return (
    <div className="w-full h-screen z-50 fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white text-[#171717] rounded-[20px] p-8 relative flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={handleShowPopup}
          className="w-8 h-8 rounded-full bg-[#F2F2F2] hover:bg-[#e6e6e6] transition absolute top-4 right-4 flex items-center justify-center p-1.5 cursor-pointer text-[#4b4b4b]"
        >
          <IoClose className="w-full h-full" />
        </button>

        <h2 className="text-xl font-extrabold text-[#0098EA]">Select type</h2>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handlePickupClick}
            className="w-full bg-[#F2F2F2] hover:bg-[#e6e6e6] p-4 rounded-xl flex items-center justify-between transition cursor-pointer text-[#171717]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0098EA] flex items-center justify-center p-2 text-white">
                <GiCardPickup className="w-full h-full text-white" />
              </div>
              <span className="text-sm font-semibold">Pickup</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-2xl text-gray-500" />
          </button>

          <button
            type="button"
            onClick={handleDeliveryClick}
            className="w-full bg-[#F2F2F2] hover:bg-[#e6e6e6] p-4 rounded-xl flex items-center justify-between transition cursor-pointer text-[#171717]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0098EA] flex items-center justify-center p-2 text-white">
                <img
                  src="/truck-icon.png"
                  alt="truck-icon"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to hidden if image is not present
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="text-sm font-semibold">Delivery</span>
            </div>
            <MdOutlineKeyboardArrowRight className="text-2xl text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
