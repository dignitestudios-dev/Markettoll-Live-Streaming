"use client";

import React, { useState } from "react";
import { IoCheckmark, IoClose } from "react-icons/io5";

interface CohostInviteModalProps {
  isOpen: boolean;
  hostUsername: string;
  liveId: string;
  invitationId?: string;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

export default function CohostInviteModal({
  isOpen,
  hostUsername,
  onAccept,
  onReject,
}: CohostInviteModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReject();
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-[360px] bg-white rounded-[28px] shadow-2xl p-6 flex flex-col gap-5 border border-gray-100">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#0098EA]/10 flex items-center justify-center">
            <span className="text-3xl">🎙️</span>
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">
            Co-Host Invitation
          </h3>
          <p className="text-sm text-gray-500 mt-1.5 leading-snug">
            <span className="font-semibold text-[#0098EA]">{hostUsername || "Host"}</span>{" "}
            has invited you to join as a co-host on their live stream.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Reject */}
          <button
            type="button"
            disabled={isRejecting || isAccepting}
            onClick={handleReject}
            className="flex-1 py-3 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-[#475569] font-semibold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isRejecting ? (
              <span className="inline-block w-4 h-4 border-2 border-gray-400/40 border-t-gray-400 rounded-full animate-spin" />
            ) : (
              <IoClose className="text-base" />
            )}
            Decline
          </button>

          {/* Accept */}
          <button
            type="button"
            disabled={isAccepting || isRejecting}
            onClick={handleAccept}
            className="flex-1 py-3 rounded-2xl bg-[#0098EA] hover:bg-[#0082c9] text-white font-bold text-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            {isAccepting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <IoCheckmark className="text-base" />
            )}
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
