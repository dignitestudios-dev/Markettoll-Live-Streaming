"use client";

import React from "react";
import {
  IoMic,
  IoMicOff,
  IoVideocam,
  IoVideocamOff,
  IoPeople,
  IoBag,
  IoSquare,
  IoRepeat,
} from "react-icons/io5";
import { HiSignal } from "react-icons/hi2";

interface LiveControlsBarProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  isMirrored: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleMirror: () => void;
  onOpenCohostModal: () => void;
  onToggleProductBanner: () => void;
  onEndLive: () => void;
}

export default function LiveControlsBar({
  isMicOn,
  isCameraOn,
  isMirrored,
  onToggleMic,
  onToggleCamera,
  onToggleMirror,
  onOpenCohostModal,
  onToggleProductBanner,
  onEndLive,
}: LiveControlsBarProps) {
  return (
    <div className="w-full py-3 px-6 bg-[#0E131F]/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-between z-40 select-none">
      {/* Left: Status info */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
          <HiSignal className="text-sm" /> LIVE BROADCAST
        </span>
      </div>

      {/* Center: Interactive Control Toolbar */}
      <div className="flex items-center gap-3 sm:gap-4 mx-auto sm:mx-0">
        {/* Mic Button */}
        <button
          type="button"
          onClick={onToggleMic}
          aria-label={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
            isMicOn
              ? "bg-[#1F293D] text-white hover:bg-[#2B3954]"
              : "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          }`}
        >
          {isMicOn ? <IoMic className="text-xl" /> : <IoMicOff className="text-xl" />}
        </button>

        {/* Camera Button */}
        <button
          type="button"
          onClick={onToggleCamera}
          aria-label={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
            isCameraOn
              ? "bg-[#1F293D] text-white hover:bg-[#2B3954]"
              : "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
          }`}
        >
          {isCameraOn ? <IoVideocam className="text-xl" /> : <IoVideocamOff className="text-xl" />}
        </button>

        {/* Flip / Mirror Camera Button */}
        <button
          type="button"
          onClick={onToggleMirror}
          title={isMirrored ? "Unflip Camera" : "Flip Camera Horizontally"}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
            isMirrored
              ? "bg-[#0098EA] text-white hover:bg-[#0082c9]"
              : "bg-[#1F293D] text-white hover:bg-[#2B3954]"
          }`}
        >
          <IoRepeat className="text-xl" />
        </button>

        {/* Co-Hosts Button */}
        <button
          type="button"
          onClick={onOpenCohostModal}
          title="Manage Co-Hosts"
          className="w-11 h-11 rounded-full bg-[#1F293D] hover:bg-[#2B3954] text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          <IoPeople className="text-xl" />
        </button>

        {/* Product Showcase Button */}
        <button
          type="button"
          onClick={onToggleProductBanner}
          title="Toggle Featured Product"
          className="w-11 h-11 rounded-full bg-[#1F293D] hover:bg-[#2B3954] text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          <IoBag className="text-xl" />
        </button>
      </div>

      {/* Right: End Stream Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEndLive}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full transition-all shadow-[0_4px_16px_rgba(220,38,38,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <IoSquare className="text-xs" /> End Live Stream
        </button>
      </div>
    </div>
  );
}
