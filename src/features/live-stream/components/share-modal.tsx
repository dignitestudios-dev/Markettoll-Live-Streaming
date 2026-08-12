"use client";

import React, { useState } from "react";
import { IoClose, IoCopyOutline, IoCheckmark, IoQrCodeOutline } from "react-icons/io5";
import { toast } from "react-toastify";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveId: string;
}

export default function ShareModal({ isOpen, onClose, liveId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://markettoll.com/live/${liveId}`;

  const displayUrl = currentUrl.replace(/^https?:\/\//, "");

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        toast.success("Stream link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const shareOptions = [
    {
      name: "Facebook",
      image: "/facebook.png",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "WhatsApp",
      image: "/whatsapp.png",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Watch this live stream: ${currentUrl}`)}`,
    },
    {
      name: "Telegram",
      image: "/airplane.png",
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("Watch live stream")}`,
    },
    {
      name: "X (Twitter)",
      image: "/twitter.png",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("Watch live stream")}`,
    },
    {
      name: "Email",
      image: "/email.png",
      url: `mailto:?subject=${encodeURIComponent("Join Live Stream")}&body=${encodeURIComponent(`Watch live stream here: ${currentUrl}`)}`,
    },
    {
      name: "LinkedIn",
      image: "/linkdin.png",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
  ];

  const handleSocialClick = (shareUrl: string) => {
    if (typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-[420px] bg-white text-[#171717] rounded-[28px] p-6 shadow-2xl flex flex-col justify-between select-none border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Share Stream</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-gray-500 hover:text-black flex items-center justify-center transition-all cursor-pointer"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        {/* 6 Share Options Grid */}
        <div className="grid grid-cols-3 gap-3.5 my-2">
          {shareOptions.map((opt) => (
            <button
              key={opt.name}
              type="button"
              onClick={() => handleSocialClick(opt.url)}
              className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2.5 hover:bg-[#F1F5F9] hover:border-gray-200 transition-all cursor-pointer group shadow-2xs active:scale-95"
            >
              <img
                src={opt.image}
                alt={opt.name}
                className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xs font-semibold text-[#334155] truncate max-w-full">
                {opt.name}
              </span>
            </button>
          ))}
        </div>

        {/* Stream Link Banner */}
        <div className="mt-4 bg-[#F8FAFC] border border-[#F1F5F9] rounded-[22px] p-3 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center shrink-0 shadow-sm">
              <IoQrCodeOutline className="text-xl" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#64748B] font-medium block leading-none mb-1">
                Stream link
              </span>
              <span className="text-xs font-semibold text-[#0F172A] truncate block">
                {displayUrl}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="bg-[#00A8E8] hover:bg-[#0092ca] active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copied ? (
              <>
                <IoCheckmark className="text-base" /> Copied
              </>
            ) : (
              <>
                <IoCopyOutline className="text-base" /> Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
