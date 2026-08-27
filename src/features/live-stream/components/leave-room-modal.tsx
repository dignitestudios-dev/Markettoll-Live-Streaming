"use client";

import React from "react";

interface LeaveRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLeaving?: boolean;
}

export default function LeaveRoomModal({
  isOpen,
  onClose,
  onConfirm,
  isLeaving = false,
}: LeaveRoomModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-room-title"
        className="
          relative w-full max-w-[420px]
          overflow-hidden
          rounded-[28px]
          bg-white
          px-6 py-7 sm:px-8 sm:py-8
          text-center
          shadow-[0_25px_70px_rgba(0,0,0,0.22)]
          animate-in zoom-in-95 slide-in-from-bottom-2
          duration-200
        "
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-100/70 blur-3xl" />

        <div className="relative flex flex-col items-center">
          {/* Icon */}
          <div
            className="
              mb-5 flex h-[68px] w-[68px] items-center justify-center
              rounded-[22px]
              bg-red-50
              ring-8 ring-red-50/60
            "
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#FF3B30]"
            >
              <path
                d="M9 3H5.8C4.806 3 4 3.806 4 4.8V19.2C4 20.194 4.806 21 5.8 21H18.2C19.194 21 20 20.194 20 19.2V4.8C20 3.806 19.194 3 18.2 3H15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M8 12H16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M13 9L16 12L13 15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3
              id="leave-room-title"
              className="
                text-[25px] sm:text-[28px]
                font-extrabold
                tracking-[-0.03em]
                text-[#111827]
              "
            >
              Leave this stream?
            </h3>

            <p className="mx-auto max-w-[320px] text-[14px] sm:text-[15px] leading-6 text-[#6B7280]">
              Are you sure you want to leave the live room? You can always
              join again later.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-7 grid w-full grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLeaving}
              className="
                h-[52px]
                rounded-2xl
                border border-[#E5E7EB]
                bg-white
                px-5
                text-[15px]
                font-bold
                text-[#111827]
                shadow-sm
                transition-all
                duration-200
                hover:bg-[#F9FAFB]
                hover:border-[#D1D5DB]
                active:scale-[0.97]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Stay
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLeaving}
              className="
                relative
                flex h-[52px]
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-2xl
                bg-[#FF3B30]
                px-5
                text-[15px]
                font-bold
                text-white
                shadow-[0_8px_20px_rgba(255,59,48,0.25)]
                transition-all
                duration-200
                hover:bg-[#E9352B]
                hover:shadow-[0_10px_25px_rgba(255,59,48,0.32)]
                active:scale-[0.97]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isLeaving ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Leaving...</span>
                </>
              ) : (
                <>
                  <span>Leave Room</span>

                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 5L16 12L9 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Bottom hint */}
          <p className="mt-4 text-[11px] font-medium text-[#9CA3AF]">
            You can rejoin the stream anytime
          </p>
        </div>
      </div>
    </div>
  );
}