"use client";

import React from "react";

interface EndStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isEnding?: boolean;
}

export default function EndStreamModal({
  isOpen,
  onClose,
  onConfirm,
  isEnding = false,
}: EndStreamModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] bg-white rounded-[36px] p-8 sm:p-10 text-center shadow-2xl flex flex-col items-center gap-6 select-none animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          End Stream?
        </h3>
        <p className="text-gray-500 text-base sm:text-lg leading-snug px-2">
          Are you sure you want to end this live stream?
        </p>

        <div className="flex items-center gap-4 w-full mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isEnding}
            className="flex-1 py-3.5 px-6 rounded-full border border-gray-200 text-[#111827] font-bold text-base hover:bg-gray-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isEnding}
            className="flex-1 py-3.5 px-6 rounded-full bg-[#FF3B30] hover:bg-[#E03228] text-white font-bold text-base shadow-lg shadow-red-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isEnding ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "End Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
