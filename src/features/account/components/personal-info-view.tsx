"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import { useAuth } from "@/hooks/use-auth";
import UpdateNameModal from "./update-name-modal";
import UpdateProfileImageModal from "./update-profile-image-modal";
import UpdatePhoneNumberModal from "./update-phone-number-modal";
import PhoneNumberSuccessModal from "./phone-number-success-modal";

export default function PersonalInfoView() {
  const { user } = useAuth();
  const userProfile = (user || {}) as any;

  const [openNameModal, setOpenNameModal] = useState(false);
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [openProfileImageModal, setOpenProfileImageModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const profileImage =
    userProfile?.profileImage ||
    userProfile?.image ||
    "/upload-profile-image-icon.png";

  const emailValue =
    typeof userProfile?.email === "object"
      ? userProfile?.email?.value
      : userProfile?.email || "";

  const phoneValue =
    typeof userProfile?.phoneNumber === "object"
      ? userProfile?.phoneNumber?.value
      : userProfile?.phoneNumber || "";

  return (
    <div className="w-full padding-x py-6 ">
      <div className="max-w-8xl mx-auto bg-white rounded-[30px] p-5 sm:p-8 shadow-xs border border-gray-100">
        <div>
          <Link
            href="/"
            className="text-sm text-[#5C5C5C] flex items-center justify-start gap-1 hover:opacity-80 transition"
          >
            <GoArrowLeft className="text-xl light-blue-text" />
            Back
          </Link>
        </div>

        <h2 className="text-[18px] font-semibold my-4 text-gray-900">
          Personal Information
        </h2>

        <div className="w-full border-t border-gray-100" />

        <div className="w-full flex items-center justify-start gap-4 mt-6">
          <div className="flex flex-col items-center gap-2">
            <img
              src={profileImage}
              alt="personal-info-img"
              className="w-[69px] md:w-[129px] h-[69px] md:h-[129px] rounded-full object-cover border border-gray-200"
            />
            <button
              type="button"
              onClick={() => setOpenProfileImageModal(true)}
              className="text-sm font-medium blue-text underline pb-0.5 cursor-pointer hover:opacity-80 transition"
            >
              Edit Photo
            </button>
          </div>
          <div className="flex flex-col items-start justify-start mb-3 gap-1">
            <span className="font-bold text-[20px] text-gray-900">
              {userProfile?.name || userProfile?.firstName || "John Smith"}
            </span>
            <span className="text-sm text-[#5C5C5C]">
              {emailValue || "user@example.com"}
            </span>
          </div>
        </div>

        <div className="w-full lg:w-[715px] bg-[#F7F7F7] rounded-[24px] p-4 md:p-8 mt-6 border border-gray-200/50">
          <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <button
                type="button"
                onClick={() => setOpenNameModal(true)}
                className="text-sm light-blue-text underline pb-0.5 cursor-pointer font-medium hover:opacity-80 transition"
              >
                Edit
              </button>
            </div>
            <input
              type="text"
              value={userProfile?.name || userProfile?.firstName || ""}
              disabled
              className="bg-white p-3.5 outline-none rounded-[15px] w-full text-sm text-gray-700 border border-gray-200/60"
              placeholder="John Smith"
            />
          </div>

          <div className="w-full mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <button
                type="button"
                onClick={() => setOpenPhoneModal(true)}
                className="text-sm light-blue-text underline pb-0.5 cursor-pointer font-medium hover:opacity-80 transition"
              >
                Edit
              </button>
            </div>
            <input
              type="text"
              disabled
              value={phoneValue}
              className="bg-white p-3.5 outline-none rounded-[15px] w-full text-sm text-gray-700 border border-gray-200/60"
              placeholder="+1 000 000 0000"
            />
          </div>
        </div>
      </div>

      <UpdateNameModal
        openNameModal={openNameModal}
        onClose={() => setOpenNameModal(false)}
      />
      <UpdatePhoneNumberModal
        openPhoneModal={openPhoneModal}
        onclick={() => setOpenPhoneModal(false)}
      />
      <UpdateProfileImageModal
        openProfileImageModal={openProfileImageModal}
        onClose={() => setOpenProfileImageModal(false)}
      />
      <PhoneNumberSuccessModal
        openSuccessModal={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
      />
    </div>
  );
}
